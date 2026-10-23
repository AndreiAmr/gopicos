# GoPicos

Plataforma para skatistas do mundo todo cadastrarem **picos** (locais para andar de skate) e avaliá-los com estrelas e comentários.

**Objetivo atual: finalizar o MVP** — login e cadastro, CRUD de picos (com avaliação por estrelas e comentários) e CRUD do perfil do usuário logado, em backend, web e mobile.

## Funcionalidades do MVP e status

Status em 22/10/2026, conforme issues e PRs do [GitHub Project #4](https://github.com/users/AndreiAmr/projects/4). O projeto está no início da execução: a maior parte do MVP ainda está em andamento.

| Área | Situação |
|---|---|
| Design system (tokens, componentes base web e mobile, spec de telas de autenticação) | Pronto (v2.0). Aplicação nas telas existentes ainda pendente |
| Backend: autenticação (contexto JWT, contrato do login e reativação de conta, cadastro com validações e erros) | Pronto |
| Backend: proteção das operações de pico, detalhe do pico, e-mail transacional, migration do MVP (modalidade, nota de avaliação, desativação lógica) | Pronto |
| Infra de testes (integração no backend; unitários em web e mobile) | Pronta |
| Login, cadastro, sessão e logout (web e mobile) | Em andamento / a fazer |
| Picos: listagem enriquecida, home com mapa, detalhe, criar, editar e excluir (web e mobile) | A fazer |
| Avaliações com estrelas e comentários (backend, web e mobile) | A fazer |
| Perfil: consultar, editar, alterar senha, excluir conta (backend, web e mobile) | A fazer |
| Recuperar senha, E2E mobile (Maestro), seed realista, checklist de release | A fazer |

Fora do MVP (já planejado no backlog): moderação e denúncia, verificação de e-mail, internacionalização, termos de uso.

## Stack

| Pacote | Tecnologias |
|---|---|
| `backend/` | Node + TypeScript, Apollo Server (GraphQL) sobre Express, Prisma + Postgres, Cloudinary (imagens), JWT, Jest |
| `web/` | React + Vite + TypeScript, Tailwind + Radix (shadcn), Redux Toolkit + Redux-Saga, Apollo Client, react-hook-form + yup, Mapbox (`react-map-gl`), Vitest |
| `mobile/` | React Native 0.85 (New Architecture) + TypeScript, Tamagui + styled-components, React Navigation, Redux Toolkit + Redux-Saga, Apollo Client, `@rnmapbox/maps`, Keychain, Jest |

## Estrutura do monorepo

```
gopicos/
├── backend/            API GraphQL (src/graphql/modules/<domínio>/<operação>, Prisma em src/prisma)
├── web/                Aplicação web (atomic design, store/<domínio>/<feature>)
├── mobile/             Aplicativo React Native (atomic design, store/<domínio>/<feature>)
├── docs/               Documentação do time (design system e specs de UX)
├── docker-compose.yml  Postgres local
└── .github/workflows/  CI/CD (deploy de QA do backend e builds de APK)
```

No backend, cada operação GraphQL segue o fluxo `resolver → controller → service → repository`. Coordenadas de picos são polígonos GeoJSON em ordem `[lng, lat]`.

## Como rodar localmente

Pré-requisitos: Node, Yarn, Docker e, para o mobile, o ambiente React Native configurado (Xcode e/ou Android Studio).

### 1. Banco de dados

```bash
cp .env.example .env     # preencha os valores
docker-compose up database
```

### 2. Variáveis de ambiente

Copie cada `.env.example` para `.env` e preencha (nunca commite valores reais).

- **Raiz** (Postgres do Docker): `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- **backend/**: `DATABASE_URL`, `JWT_SECRET`, `BCRYPT_SALTS`, `PORT`, `LOCATION_IQ_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, além da configuração do Cloudinary (variável `CLOUDINARY_URL`, lida pelo SDK). Sem `RESEND_API_KEY` o envio de e-mail é apenas simulado. Consulte `backend/.env.example` para a lista atualizada.
- **web/**: `VITE_MAPBOX_ACCESS_TOKEN`
- **mobile/**: `API_URL` (opcional; sobrescreve o endereço do backend)

### 3. Backend

```bash
cd backend
yarn install
yarn generate   # gera o Prisma Client
yarn migrate    # aplica migrations
yarn mock       # seed (opcional)
yarn dev        # sobe a API (porta 4000 por padrão)
```

Outros comandos: `yarn build`, `yarn setup` (migrate + mock), `yarn prisma:studio`.

### 4. Web

```bash
cd web
yarn install
yarn dev
```

Outros comandos: `yarn build`, `yarn lint`, `yarn generate` (scaffolds com plop).

### 5. Mobile

```bash
cd mobile
yarn install
yarn start      # Metro
yarn ios        # em outro terminal (rode `pod install` em mobile/ios na primeira vez)
yarn android
```

> **Android emulator:** o emulador acessa o backend da máquina host por `10.0.2.2`; o iOS simulator usa `localhost`. A escolha é automática em `mobile/src/config/apollo.ts` (porta 4000), a menos que `API_URL` seja definida.

## Testes

- **Backend** (Jest, integração contra um Postgres isolado de teste): `cd backend && yarn test`. O passo a passo para subir o banco de teste está em [`backend/README.md`](backend/README.md).
- **Web** (Vitest): `cd web && yarn test`
- **Mobile** (Jest): `cd mobile && yarn test`
- **Lint:** `yarn lint` em `web/` e `mobile/`
- **E2E mobile** com Maestro está planejado (issue GP-091), ainda não implementado.

## Como contribuir

- Cada tarefa é uma issue no [GitHub Project #4](https://github.com/users/AndreiAmr/projects/4).
- Crie **uma branch por tarefa a partir de `main`**: `feature/<issue>-<slug>`, `fix/<issue>-<slug>` ou `chore/<slug>`.
- Commits em **Conventional Commits, em português**: `feat(mobile): ...`, `fix(backend): ...`, `docs: ...`.
- Abra o PR para `main` referenciando a issue (`Closes #N`). Antes, garanta lint, build/type-check e testes passando nos pacotes alterados.
- O QA revisa o PR; o parecer é um comentário de review começando por `QA: APROVADO` ou `QA: MUDANÇAS NECESSÁRIAS`.
- A branch **`development` é reservada para gerar o APK de teste** (workflow `mobile-qa-build.yml`). Nunca abra PR de feature para ela.
- Nunca commite `.env`, segredos ou `console.log` de debug.

## Documentação

- [`docs/design/design-system.md`](docs/design/design-system.md) — design system
- [`docs/design/specs/`](docs/design/specs) — specs de UX das telas
- [GitHub Project #4](https://github.com/users/AndreiAmr/projects/4) — backlog e andamento
