# GoPicos - Backend

## Testes de integração

Jest + ts-jest contra um Postgres **isolado** (nunca o `gp_database` nem o `.env` local).

### Rodando

```bash
# 1. Postgres descartável de teste (porta 54329)
docker run -d --rm --name gp-test-pg \
  -e POSTGRES_USER=gp_test -e POSTGRES_PASSWORD=gp_test -e POSTGRES_DB=gopicos_test \
  -p 54329:5432 postgres:16-alpine

# 2. Gerar o Prisma Client (uma vez) e rodar os testes
cd backend
yarn generate
yarn test

# 3. Remover o banco ao terminar
docker rm -f gp-test-pg
```

- A URL padrão é `postgresql://gp_test:gp_test@localhost:54329/gopicos_test?schema=public`. Para usar outro banco, defina `TEST_DATABASE_URL`.
- Trava de segurança: o nome do database **precisa terminar em `_test`**, senão a suíte aborta.
- As migrations são aplicadas automaticamente (`prisma migrate deploy`) antes da suíte (`src/test/globalSetup.ts`).
- Os testes rodam em série e cada teste começa com o banco limpo (`TRUNCATE`), via `useTestDatabase()`.
- Seed opcional: `DATABASE_URL=<url de teste> yarn mock` popula o banco de teste com os dados de exemplo (os testes não dependem dele; usam factories).

### Escrevendo um teste

Arquivos `*.test.ts` dentro de `src/`. Helpers em `src/test/`:

```ts
import { useTestDatabase } from '../../test/db';
import { createUser, createSpot, createSpotReview, tokenFor } from '../../test/factories';
import { executeAnonymous, executeAuthenticated } from '../../test/graphql';

describe('minha operação', () => {
  useTestDatabase(); // limpa o banco antes de cada teste

  it('exige autenticação', async () => {
    const user = await createUser();
    const anon = await executeAnonymous(MUTATION, { ... });
    const auth = await executeAuthenticated(tokenFor(user), MUTATION, { ... });
    // erros: errors[0].extensions.type / statusCode
  });
});
```

Exemplo completo: `src/graphql/modules/authentication/login/login.integration.test.ts`.

## E-mail transacional

Serviço em `src/services/email` (interface `EmailTransport`, trocável). Provedor atual: [Resend](https://resend.com) via API HTTPS (sem dependência extra; funciona no Render, que bloqueia SMTP no plano gratuito).

```ts
import { getEmailService } from '../services/email';
await getEmailService().sendPasswordResetCode({ to, name, code }); // código de 6 dígitos, válido por 15 min
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `RESEND_API_KEY` | não | Chave da API do Resend. **Sem ela o envio é simulado**: registra no log o assunto e o destinatário mascarado, nunca o código, e não quebra o fluxo. |
| `EMAIL_FROM` | não (recomendada em produção) | Remetente, ex.: `GoPicos <no-reply@seudominio.com>`. O domínio precisa estar verificado no Resend. Padrão: `GoPicos <no-reply@gopicos.com>`. |

A chamada ao Resend aborta após 10 s e falhas de rede/timeout viram o erro uniforme `Falha ao enviar e-mail pelo Resend` (sem a API key). Quem chamar `sendPasswordResetCode` (ex.: GP-029) deve capturar o erro para não derrubar o fluxo nem revelar se o e-mail existe.

### Passo a passo para o dono (produção/QA no Render)

1. Criar a conta em [resend.com](https://resend.com) (plano gratuito).
2. Adicionar e verificar o domínio de envio (registros DNS SPF e DKIM).
3. Criar uma API key.
4. No Render, definir `RESEND_API_KEY` (a chave) e `EMAIL_FROM` (ex.: `GoPicos <no-reply@seudominio.com>`).

Atenção: o remetente padrão `no-reply@gopicos.com` só funciona se esse domínio estiver verificado; sem `EMAIL_FROM` válido, o Resend recusa o envio (HTTP 403/422).

Para testar sem domínio: use `EMAIL_FROM="GoPicos <onboarding@resend.dev>"`; nesse modo o Resend só entrega ao e-mail do dono da conta.

Veja `.env.example`. Em testes, injete um transporte falso com `createEmailService(transport)`.
