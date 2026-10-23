# GoPicos - Backlog do MVP

A fonte única do backlog e das tarefas é o GitHub Project **GoPicos MVP** (https://github.com/users/AndreiAmr/projects/4), com uma issue por história. Este arquivo é o registro de referência do PO (substitui `mobile/PLANO_DE_ACAO.md`) e deve ser mantido em sincronia com as issues. IDs `GP-xxx` são estáveis; não renumerar. Prioridade MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (neste MVP). Plataformas: BE = backend, WEB, MOB.

Convenções de regra de negócio (valem para todas as histórias):
- Operações de escrita exigem usuário autenticado; a identidade vem **sempre do token**, nunca do input.
- Somente o autor edita/exclui o próprio pico e a própria avaliação.
- Erros devolvem `type` + `message` em pt-BR (padrão `AppError`); telas mostram mensagem amigável, nunca texto técnico.
- Coordenadas: polígono GeoJSON em `[lng, lat]`.
- Usuário **nunca é excluído fisicamente** do banco: "Excluir conta" apenas desativa (D4).

## Estado atual por plataforma

### Backend (`main`)
| Área | Situação |
|---|---|
| Modelo (Prisma) | `User`, `Spot`, `SpotReview` (com `title`, `description`, `parentId` para respostas). **`SpotReview` não tem nota em estrelas.** `User` não tem nickname (mas o input de `signup` aceita `nickname`, que é ignorado). `Spot.modality` é string livre. Sem regra de cascata/anonimização na exclusão de usuário. |
| Auth | `signup` (bcrypt, valida e-mail) e `login` (JWT) existem. Login tem **`setTimeout` de 3s artificial** e `console.log` de debug. Sem expiração/refresh definidos como regra de produto. |
| Picos | `getAllSpots` (@Authenticated), `getSpotById` (@Authenticated, com reviews), `createSpot` (**sem @Authenticated** e **`authorId` fixo hardcoded** no service). Não existe editar nem excluir. |
| Avaliações | Schema `createSpotReview` existe mas o **resolver não está registrado** em `resolvers.ts`; sem editar/excluir/listar paginado; sem média. |
| Perfil | **Nada**: não há `getProfile`/`me`, `updateProfile`, `changePassword`, `deleteAccount`. `UserRepository.update/delete` lançam "not implemented". |
| Outros | Geocoding direto/reverso OK. Upload de imagens via Cloudinary. Sem testes automatizados. Muitos `console.log`. |

### Web (`main`)
- Rotas: `/` (login), `/home` (mapa com picos), `/spot/new-spot` (wizard de criação, mapa + detalhes), `/spot/new-spot/details` é **placeholder**.
- Existe: login (signIn com Redux/Saga), listagem de picos no mapa, desenho de polígono, busca de lugar, geocoding reverso, upload de imagens no formulário.
- Falta: cadastro, guard de rotas/logout, detalhe do pico, editar/excluir, avaliações, perfil (existe store `profile` que chama um `getProfile` **inexistente no backend**), design system novo.

### Mobile (`main`)
- Apenas tela Login (sem tratamento de erro/sucesso, sem sessão). `PLANO_DE_ACAO` datado de 23/06/2026.
### Mobile (branch `feature/mobile-home-map`, **considerada existente**, ainda não em `main`)
- Home com mapa Mapbox exibindo polígonos e centros dos picos (`getAllSpots`), seletor de camadas (streets/outdoors/satellite), botão de localização, header com filtro, TabBar customizada, loader animado.
- Store Redux/Saga: `login` (parcial; saga ainda sem chamar a API), `spots/allSpots`. Token no Keychain via Apollo `authLink`. `navigationRef` para navegação fora de componentes.
- Falta ainda: sessão persistente/guard, cadastro, logout, detalhe, criar/editar/excluir pico, avaliações, perfil, design system novo.

---

## Épicos

| ID | Épico | Tipo |
|---|---|---|
| E1 | Design System (UX) e aplicação em web e mobile | Habilitador |
| E2 | Fundação técnica e segurança do backend | Habilitador |
| E3 | Autenticação (login, cadastro, sessão) | Funcional |
| E4 | Picos (CRUD, mapa, detalhe) | Funcional |
| E5 | Avaliações (estrelas + comentários) | Funcional |
| E6 | Perfil do usuário (CRUD) | Funcional |
| E7 | Qualidade e entrega | Habilitador |
| E8 | Identidade de rua e interação (grafite, bottom sheet no mobile, sem sobreposição) | Transversal |

Ordem sugerida: E1 e E2 em paralelo -> E3 -> E4 e E6 (BE) -> E5 -> E7. E8 (2026-10-23) é transversal: começa pelas histórias de UX e só chega aos devs após a aprovação do dono. Fatiamento de telas segue o design system quando disponível; até lá, Dev implementa BE e lógica (hooks/store) e telas com estilo provisório.

---

## E1 - Design System (habilitador)

**GP-001 - Fundação do design system (tokens)** | M | UX (docs/design) | Dep.: nenhuma
Como time, quero tokens (cores, tipografia, espaçamento, raios, sombras, modo claro/escuro se decidido) e princípios documentados, para que web e mobile compartilhem a mesma identidade.
```gherkin
Dado que o UX concluiu o design system
Quando o Dev consulta docs/design
Então encontra tokens nomeados, escala tipográfica e diretrizes de uso
E os tokens têm mapeamento para Tailwind (web) e Tamagui/tema (mobile)
```

**GP-002 - Componentes base do DS: biblioteca web** | M | WEB | Dep.: GP-001
Como dev web, quero Button, Input, Text, Card, Modal/Sheet, Toast, Skeleton, EmptyState e StarRating conforme o DS, para montar telas sem estilo ad-hoc.
```gherkin
Dado que um componente do DS existe em atomic/
Quando é usado em uma tela
Então usa apenas tokens do DS e cobre estados default, foco, desabilitado, erro e loading
```

**GP-003 - Componentes base do DS: biblioteca mobile** | M | MOB | Dep.: GP-001
Mesma história de GP-002 para mobile (Tamagui/styled-components), incluindo BottomSheet, StarRating, Loader.
```gherkin
Dado que um componente do DS existe em atomic/
Quando é renderizado no iOS e no Android
Então segue o DS e cobre estados default, pressed, desabilitado, erro e loading
```

**GP-004 - Aplicar DS nas telas existentes (web)** | S | WEB | Dep.: GP-002
```gherkin
Dado as telas login, home e novo pico
Quando o DS é aplicado
Então nenhuma cor/fonte fica hardcoded fora dos tokens e o comportamento não regride
```

**GP-005 - Aplicar DS nas telas existentes (mobile)** | S | MOB | Dep.: GP-003, merge de `feature/mobile-home-map`
```gherkin
Dado as telas login e home com mapa
Quando o DS é aplicado
Então Header, TabBar, LayerMenu e Login usam os componentes e tokens do DS sem regressão
```
Nota: telas novas dos demais épicos já nascem no DS; GP-004/005 cobrem somente o legado.

---

## E2 - Fundação técnica e segurança do backend (habilitador)

**GP-010 - Contexto de autenticação com JWT** | M | BE | Dep.: nenhuma
Como sistema, quero validar o JWT em toda requisição e expor o usuário em `context.auth`, para identificar o autor de cada ação.
```gherkin
Cenário: token válido
  Dado um header Authorization "Bearer <token válido>"
  Quando uma operação @Authenticated é chamada
  Então context.auth contém o id do usuário do token
Cenário: token ausente, inválido ou expirado
  Quando uma operação @Authenticated é chamada
  Então retorna erro UNAUTHENTICATED (401) com mensagem em pt-BR
```

**GP-011 - Proteger e corrigir operações de pico** | M | BE | Dep.: GP-010
Como sistema, quero que `createSpot` exija autenticação e use o `authorId` do token (remover id fixo), e que `createSpotReview` seja registrado no `resolvers.ts`.
```gherkin
Dado um usuário autenticado
Quando cria um pico
Então o pico é salvo com authorId igual ao id do token
Dado uma requisição sem token
Quando tenta criar pico ou avaliação
Então recebe UNAUTHENTICATED
```

**GP-012 - Limpeza do backend** | M | BE | Dep.: nenhuma
Remover o atraso artificial de 3s do login, `console.log` de debug (incluindo `context.auth` na diretiva), garantir que `password` nunca saia em respostas/logs.
```gherkin
Quando o login é executado com credenciais válidas
Então responde em tempo normal (sem delay artificial)
E nenhum log contém senha, hash ou token
```

**GP-013 - Infra de testes de integração do backend** | M | BE | Dep.: nenhuma
Jest + Postgres local + seed (`yarn mock`), com helper para executar operações GraphQL com/sem token.
```gherkin
Quando rodo o comando de testes do backend
Então os testes de integração sobem contra o banco de teste, isolam dados e passam no CI local
```

**GP-014 - Infra de testes unitários web e mobile (sagas/hooks)** | S | WEB, MOB | Dep.: nenhuma
```gherkin
Quando rodo yarn test no pacote
Então existe um exemplo de teste de saga e de hook usando o padrão a ser seguido pelas demais histórias
```

**GP-015 - Padronizar erros GraphQL e tratamento nos clientes** | S | BE, WEB, MOB | Dep.: GP-012
Códigos estáveis (`INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `UNAUTHENTICATED`, `INVALID_RESET_CODE`) e função única nos clientes que os traduz em mensagem para o usuário.
```gherkin
Dado um erro conhecido do backend
Quando o cliente o recebe
Então exibe a mensagem amigável correspondente; para erro desconhecido ou de rede exibe mensagem genérica com opção de tentar novamente
```

**GP-016 - Modelo de dados: preparar migrations do MVP** | M | BE | Dep.: decisões D2, D4, D6, D10
Migration única e coordenada: rating em `SpotReview`, remoção/ajuste de `title`, unicidade (autor, pico), desativação lógica de usuário (ex.: `deactivatedAt`, sem `onDelete` em cascata a partir de `User`), tabela/campos de código de recuperação de senha (D1), enum de modalidade, índices.
```gherkin
Quando rodo yarn migrate em banco existente
Então as migrations aplicam sem perda de dados dos picos atuais
E o seed (yarn mock) gera avaliações com nota
```

**GP-017 - Envio de e-mail transacional (backend)** | M | BE | Dep.: nenhuma
Como sistema, quero enviar e-mails transacionais (inicialmente o código de recuperação de senha), para permitir o fluxo de D1. Provedor é decisão técnica do Dev; credenciais só via `.env`/secrets.
```gherkin
Dado o provedor configurado por variáveis de ambiente
Quando o sistema solicita o envio de um e-mail
Então o e-mail é enviado com remetente do GoPicos e texto em pt-BR
Dado ambiente local/teste sem provedor configurado
Então o envio é simulado (registrado sem dados sensíveis) e não quebra o fluxo
```

---

## E3 - Autenticação

**GP-020 - Cadastro: validações e erros (backend)** | M | BE | Dep.: GP-013
Como visitante, quero me cadastrar com nome, e-mail e senha, para acessar o app.
```gherkin
Cenário: sucesso
  Quando envio nome, e-mail válido e senha com ao menos 8 caracteres
  Então o usuário é criado com senha em hash e recebo mensagem de sucesso
Cenário: e-mail duplicado
  Quando envio um e-mail já cadastrado
  Então recebo EMAIL_ALREADY_EXISTS (e não erro interno)
Cenário: dados inválidos
  Quando envio e-mail malformado ou senha curta
  Então recebo VALIDATION_ERROR indicando o campo
```
Nota: e-mail comparado sem diferenciar maiúsculas/minúsculas.

**GP-021 - Login: contrato e expiração do token (backend)** | M | BE | Dep.: GP-010, D8
```gherkin
Dado credenciais válidas
Quando faço login
Então recebo token, exp, id, name e email
Dado e-mail inexistente ou senha errada
Quando faço login
Então recebo a MESMA mensagem INVALID_CREDENTIALS (não revelar qual campo falhou)
Dado uma conta desativada (GP-073) e senha correta
Quando faço login
Então a conta é reativada, recebo o token normalmente e `reactivated: true` (nos demais logins, `reactivated: false`)
E meus picos e avaliações voltam a exibir meu nome
E o app mostra "Bem-vindo de volta! Sua conta foi reativada." (D14)
```

**GP-022 - Login mobile completo** | M | MOB | Dep.: GP-021, merge `feature/mobile-home-map`
Completar saga/slice de login (a saga atual não chama a API), erro, loading, gravar token no Keychain, navegar à Home.
```gherkin
Cenário: sucesso
  Dado credenciais válidas
  Quando toco em Entrar
  Então vejo loading, o token é salvo no Keychain e sou levado à Home
Cenário: erro
  Dado credenciais inválidas
  Quando toco em Entrar
  Então vejo "E-mail ou senha inválidos" e permaneço no Login
Cenário: sem rede
  Então vejo mensagem de falha de conexão com opção de tentar de novo
```

**GP-023 - Cadastro mobile** | M | MOB | Dep.: GP-020
```gherkin
Dado que estou na tela de Cadastro
Quando preencho dados válidos e confirmo
Então a conta é criada e sou levado ao Login com o e-mail preenchido e aviso de conta criada (D15)
Quando o e-mail já existe
Então vejo erro no campo e-mail
E o botão fica desabilitado enquanto envia
```

**GP-024 - Sessão persistente e guard de rotas (mobile)** | M | MOB | Dep.: GP-022
```gherkin
Dado que fiz login e fechei o app
Quando abro o app novamente com token válido
Então vou direto à Home sem ver o Login
Dado token ausente ou expirado (UNAUTHENTICATED)
Quando uso qualquer tela protegida
Então token é removido do Keychain e sou levado ao Login
```

**GP-025 - Logout (mobile)** | M | MOB | Dep.: GP-024
```gherkin
Quando confirmo "Sair" no perfil
Então o token é apagado do Keychain, o estado Redux é limpo e volto ao Login
E o botão voltar não retorna a telas protegidas
```

**GP-026 - Login web: completar** | M | WEB | Dep.: GP-021
Já existe login; adicionar erros padronizados, persistência de token e redirecionamento.
```gherkin
Dado credenciais válidas
Quando envio o formulário
Então sou redirecionado a /home com sessão persistida
Dado credenciais inválidas
Então vejo a mensagem de erro sem perder o e-mail digitado
```

**GP-027 - Cadastro web** | M | WEB | Dep.: GP-020
```gherkin
Dado a página /cadastro
Quando preencho dados válidos
Então a conta é criada e sou levado ao login com o e-mail preenchido e aviso de conta criada (D15)
E validações de formulário (yup) aparecem por campo antes do envio
```

**GP-028 - Guard de rotas e logout (web)** | M | WEB | Dep.: GP-026
```gherkin
Dado que não estou autenticado
Quando acesso /home ou /spot/*
Então sou redirecionado ao login e, após logar, volto à rota pretendida
Quando clico em Sair
Então a sessão é encerrada e vou ao login
```

**GP-029 - Recuperar senha (backend)** | M | BE | Dep.: GP-017, GP-016, D1
Como usuário que esqueceu a senha, quero receber um código por e-mail e definir uma nova senha, para voltar a acessar o app. Código numérico de 6 dígitos (funciona igual no mobile e na web, sem deep link), válido por 15 minutos e de uso único.
```gherkin
Cenário: solicitar código
  Quando informo um e-mail
  Então recebo SEMPRE a mesma resposta de sucesso, exista ou não a conta (não revelar e-mails cadastrados)
  E, se a conta existe, um código é enviado e códigos anteriores deixam de valer
Cenário: redefinir senha
  Dado um código válido e uma nova senha com ao menos 8 caracteres
  Quando redefino a senha
  Então a nova senha é gravada com hash e o código é invalidado
Cenário: código inválido, expirado ou já usado
  Então recebo INVALID_RESET_CODE e nada muda
Cenário: força bruta
  Dado 5 tentativas erradas para o mesmo código
  Então o código é invalidado e é preciso solicitar outro
Cenário: conta desativada
  Quando redefino a senha de uma conta desativada
  Então a senha é alterada e a conta é reativada no próximo login (GP-021)
```

**GP-099 - Termos de uso e política de privacidade** | M | BE, WEB, MOB | Dep.: GP-020, D17
Como visitante, quero ler e aceitar os termos de uso e a política de privacidade ao me cadastrar, para saber como meus dados são usados (exigência das lojas para publicação).
```gherkin
Dado a tela de Cadastro
Então vejo um aceite obrigatório com links para "Termos de uso" e "Política de privacidade"
Quando tento cadastrar sem aceitar
Então vejo erro no aceite e a conta não é criada
Quando aceito e cadastro
Então o backend grava a data do aceite e a versão dos termos no usuário
E o backend recusa cadastro sem aceite com VALIDATION_ERROR
E os textos ficam acessíveis sem login (web: /termos e /privacidade; mobile: tela ou link para a web)
```
Nota: o conteúdo jurídico dos textos é fornecido pelo dono; o time entrega estrutura e páginas com texto provisório marcado como tal. ID fora da faixa do épico (IDs estáveis).

**GP-098 - Recuperar senha (mobile e web)** | M | WEB, MOB | Dep.: GP-029, GP-022, GP-026
Link "Esqueci minha senha" no Login, tela para informar o e-mail e tela para código + nova senha + confirmação.
```gherkin
Quando informo meu e-mail e confirmo
Então vejo "Se o e-mail estiver cadastrado, enviamos um código" e vou à tela do código
Quando informo código válido, nova senha e confirmação iguais
Então vejo confirmação e volto ao Login com o e-mail preenchido
Quando o código é inválido ou expirou
Então vejo o erro no campo e a opção "Reenviar código"
E "Reenviar código" só fica disponível 30 segundos após o último envio (D16)
E loading, erro de rede e botão desabilitado durante o envio são tratados
```
Nota: ID fora da faixa do épico porque os IDs são estáveis e a faixa E3 estava cheia.

---

## E4 - Picos

**GP-030 - Listagem de picos enriquecida (backend)** | M | BE | Dep.: GP-016
`getAllSpots` passa a retornar média de estrelas e quantidade de avaliações, e aceita filtros opcionais (modalidade, pago, coberto).
```gherkin
Dado picos com avaliações
Quando consulto getAllSpots
Então cada pico traz ratingAverage (1 casa decimal) e reviewsCount
Quando passo filtro isPaid=false
Então recebo apenas picos gratuitos
```

**GP-031 - Home mobile com mapa de picos: finalizar e integrar** | M | MOB | Dep.: GP-030; branch `feature/mobile-home-map`
Trabalho existente (mapa, polígonos, camadas, localização). Falta: tocar no pico abre pré-visualização/detalhe, estados loading/vazio/erro, tratar UNAUTHENTICATED.
```gherkin
Dado picos cadastrados
Quando abro a Home
Então vejo os polígonos/pins no mapa e minha posição (se permitida)
Quando toco em um pico
Então vejo um resumo (nome, nota, modalidade) com ação "Ver detalhes"
Dado que não há picos
Então vejo estado vazio convidando a cadastrar o primeiro
Dado falha na consulta
Então vejo erro com "Tentar novamente"
```

**GP-032 - Home web com mapa de picos: finalizar** | M | WEB | Dep.: GP-030
```gherkin
Dado picos cadastrados
Quando abro /home
Então vejo os polígonos e, ao clicar, um resumo com link para o detalhe
E loading, vazio e erro são tratados
```

**GP-033 - Detalhe do pico (backend)** | M | BE | Dep.: GP-016
`getSpotById` com autor (id, nome), ratingAverage, reviewsCount e flag `isOwner`; reviews saem via query paginada própria (GP-063).
```gherkin
Dado um pico existente
Quando consulto getSpotById
Então recebo todos os campos, o autor, a média e a contagem
Dado id inexistente
Então recebo NOT_FOUND
```

**GP-034 - Tela de detalhe do pico (mobile)** | M | MOB | Dep.: GP-033, GP-031
```gherkin
Quando abro um pico
Então vejo galeria de fotos, nome, descrição, modalidade, preço/horário/cobertura/equipamento, nota média e mapa do polígono
E se sou o autor vejo as ações Editar e Excluir; se não, não vejo
E loading/erro/não encontrado são tratados
```

**GP-035 - Página de detalhe do pico (web)** | M | WEB | Dep.: GP-033, GP-032
Mesmo critério de GP-034 em `/spot/:id`.
```gherkin
Quando acesso /spot/:id de um pico existente
Então vejo as informações completas e, se sou autor, Editar e Excluir
Quando o id não existe
Então vejo página "Pico não encontrado"
```

**GP-036 - Criar pico: validação e imagens (backend)** | M | BE | Dep.: GP-011, GP-016
```gherkin
Cenário: sucesso
  Dado usuário autenticado e dados válidos (nome, descrição, modalidade, polígono fechado com ao menos 3 pontos, ao menos 1 foto)
  Quando crio o pico
  Então ele é salvo com as fotos no Cloudinary e authorId do token
Cenário: inválido
  Quando faltam campos obrigatórios, polígono inválido, ou isPaid sem entryAmount, ou alwaysOpen=false sem openingHours
  Então recebo VALIDATION_ERROR indicando o campo
Cenário: limites
  Quando envio mais de 5 imagens ou arquivo não-imagem
  Então recebo erro de validação
```
Nota: limites (5 fotos, tamanho) sujeitos a D9.

**GP-037 - Criar pico (web): completar wizard** | M | WEB | Dep.: GP-036
Existe seleção no mapa e formulário de detalhes; falta a etapa `/spot/new-spot/details` ligada ao envio, feedback e redirecionamento.
```gherkin
Dado que desenhei o polígono e preenchi os detalhes
Quando confirmo
Então o pico é criado, vejo sucesso e vou ao detalhe do novo pico
Dado erro de validação do servidor
Então os erros aparecem nos campos correspondentes
```

**GP-038 - Criar pico (mobile): marcar local no mapa** | M | MOB | Dep.: GP-031
Passo 1: desenhar/ajustar polígono sobre o mapa (e usar posição atual), com sugestão de endereço via geocoding reverso.
```gherkin
Quando toco em "Novo pico"
Então posso adicionar vértices no mapa, desfazer o último e limpar
E o botão Continuar só habilita com ao menos 3 pontos
```

**GP-039 - Criar pico (mobile): detalhes, fotos e envio** | M | MOB | Dep.: GP-038, GP-036
```gherkin
Dado o polígono definido
Quando preencho nome, descrição, modalidade, preço, horário, cobertura, equipamento e escolho fotos (câmera/galeria)
E confirmo
Então vejo loading, o pico é criado e vou ao seu detalhe
Dado falha de rede no envio
Então os dados preenchidos são mantidos e posso tentar de novo
```

**GP-040 - Editar pico (backend)** | M | BE | Dep.: GP-011
`updateSpot` (campos, geometria, adicionar/remover imagens).
```gherkin
Dado que sou o autor
Quando atualizo o pico com dados válidos
Então as alterações são salvas
Dado que NÃO sou o autor
Então recebo FORBIDDEN e nada é alterado
Dado pico inexistente
Então recebo NOT_FOUND
```

**GP-041 - Editar pico (web)** | M | WEB | Dep.: GP-040, GP-035
```gherkin
Dado que sou o autor
Quando clico em Editar, altero campos e salvo
Então vejo o detalhe atualizado
Dado que não sou o autor e acesso /spot/:id/edit
Então sou redirecionado ao detalhe com aviso
```

**GP-042 - Editar pico (mobile)** | M | MOB | Dep.: GP-040, GP-034, GP-039
Reutiliza o formulário de criação pré-preenchido.
```gherkin
Dado que sou o autor
Quando toco em Editar, altero e salvo
Então o detalhe e o mapa refletem a mudança sem recarregar o app
```

**GP-043 - Excluir pico (backend)** | M | BE | Dep.: GP-011, GP-016
```gherkin
Dado que sou o autor
Quando excluo o pico
Então o pico, suas avaliações e imagens associadas são removidos
Dado que não sou o autor
Então recebo FORBIDDEN
```

**GP-044 - Excluir pico (web)** | M | WEB | Dep.: GP-043, GP-035
```gherkin
Quando clico em Excluir
Então vejo confirmação "Esta ação não pode ser desfeita"
E ao confirmar o pico some do mapa e volto à home
```

**GP-045 - Excluir pico (mobile)** | M | MOB | Dep.: GP-043, GP-034
Mesmo critério de GP-044 com confirmação em modal/sheet nativo.

**GP-046 - Busca de lugar no mapa (mobile)** | S | MOB | Dep.: GP-031
Backend de geocoding direto já existe.
```gherkin
Quando digito uma cidade ou endereço na busca
Então vejo sugestões e, ao escolher, o mapa centraliza no local
Quando não há resultados
Então vejo estado vazio de busca
```

**GP-047 - Filtros de picos (mobile e web)** | S | WEB, MOB | Dep.: GP-030
Filtros por modalidade, pago/gratuito, coberto, nota mínima. O Header mobile da branch já tem `FilterInfo`.
```gherkin
Quando aplico "Gratuito" e "Coberto"
Então o mapa mostra só picos que atendem aos dois critérios
E há ação "Limpar filtros"
```

**GP-048 - Seletor de camadas do mapa (mobile)** | C | MOB | Dep.: branch existente
Já implementado na branch `feature/mobile-home-map` (streets/outdoors/satellite); apenas validar e fechar.

---

## E5 - Avaliações (estrelas + comentários)

**GP-060 - Modelo de avaliação com estrelas (backend)** | M | BE | Dep.: D2, D3
Adicionar `rating` (inteiro 1 a 5) ao `SpotReview`; comentário opcional; no máximo uma avaliação por usuário por pico. Parte da migration de GP-016.
```gherkin
Dado o schema migrado
Então SpotReview possui rating obrigatório (1-5) e unicidade (authorId, spotId)
```

**GP-061 - Criar avaliação (backend)** | M | BE | Dep.: GP-011, GP-060
```gherkin
Cenário: sucesso
  Dado usuário autenticado que ainda não avaliou o pico
  Quando envia rating 4 e comentário opcional
  Então a avaliação é salva e a média do pico é atualizada
Cenário: duplicada
  Dado que já avaliei o pico
  Então recebo REVIEW_ALREADY_EXISTS (para alterar, usar edição)
Cenário: nota inválida
  Quando rating é 0, 6 ou não inteiro
  Então recebo VALIDATION_ERROR
```
Pendente: D5 (autor do pico pode avaliar o próprio pico).

**GP-062 - Editar e excluir avaliação própria (backend)** | M | BE | Dep.: GP-061
```gherkin
Dado que sou o autor da avaliação
Quando edito nota/comentário ou excluo
Então a mudança é salva e a média recalculada
Dado que não sou o autor
Então recebo FORBIDDEN
```

**GP-063 - Listar avaliações do pico com paginação (backend)** | M | BE | Dep.: GP-060
```gherkin
Dado um pico com 25 avaliações
Quando consulto a primeira página (tamanho 10)
Então recebo 10 avaliações da mais recente à mais antiga, com autor (nome) e cursor/total
E o resumo traz média e contagem
```

**GP-064 - Avaliar e ver avaliações (mobile)** | M | MOB | Dep.: GP-061, GP-063, GP-034, GP-003
Componente StarRating, lista de avaliações no detalhe, formulário (sheet) de nova avaliação.
```gherkin
Dado que estou no detalhe de um pico que não avaliei
Quando seleciono 4 estrelas, escrevo um comentário e envio
Então minha avaliação aparece no topo da lista e a média é atualizada
Dado que não selecionei estrelas
Então o botão Enviar fica desabilitado
Dado pico sem avaliações
Então vejo estado vazio "Seja o primeiro a avaliar"
```

**GP-065 - Avaliar e ver avaliações (web)** | M | WEB | Dep.: GP-061, GP-063, GP-035, GP-002
Mesmo critério de GP-064 em `/spot/:id`, com paginação "Carregar mais".

**GP-066 - Editar e excluir minha avaliação (mobile)** | M | MOB | Dep.: GP-062, GP-064
```gherkin
Dado que já avaliei o pico
Quando abro o detalhe
Então vejo minha avaliação com Editar e Excluir (e o formulário de nova avaliação não aparece)
Quando excluo e confirmo
Então a avaliação some e posso avaliar novamente
```

**GP-067 - Editar e excluir minha avaliação (web)** | M | WEB | Dep.: GP-062, GP-065
Mesmo critério de GP-066.

**GP-068 - Exibir nota média nos pins e no resumo do mapa** | S | WEB, MOB | Dep.: GP-030
```gherkin
Dado picos com avaliações
Quando vejo o resumo do pico no mapa
Então aparece a média com estrelas e a contagem; sem avaliações aparece "Sem avaliações"
```

**GP-069 - Respostas a avaliações (threads)** | W | BE, WEB, MOB
O campo `parentId` existe no modelo, mas respostas ficam fora do MVP (ver D3).

---

## E6 - Perfil do usuário (CRUD)

**GP-070 - Consultar meu perfil (backend)** | M | BE | Dep.: GP-010
Query `me`/`getProfile` (o store web já chama `getProfile`, que não existe).
```gherkin
Dado usuário autenticado
Quando consulto meu perfil
Então recebo id, nome, e-mail e data de cadastro (nunca a senha)
Dado token inválido
Então recebo UNAUTHENTICATED
```

**GP-071 - Editar perfil (backend)** | M | BE | Dep.: GP-070
Atualiza nome (e-mail apenas se D7 permitir).
```gherkin
Quando envio nome e sobrenome válidos (não vazios, até 40 caracteres cada - D37, GP-081)
Então o perfil é atualizado e recebo o novo perfil
Quando tento alterar o perfil de outro usuário
Então a operação ignora o input de id (usa o do token)
```

**GP-072 - Alterar senha (backend)** | S | BE | Dep.: GP-070
```gherkin
Dado senha atual correta e nova senha válida (mín. 8)
Quando altero a senha
Então a nova senha é gravada com hash
Dado senha atual incorreta
Então recebo INVALID_CREDENTIALS e nada muda
```

**GP-073 - Excluir (desativar) conta (backend)** | M | BE | Dep.: GP-070, GP-016, D4
Regra (D4): "Excluir conta" **nunca apaga o usuário do banco**, apenas o desativa. Picos e avaliações são mantidos e exibem o autor como "Usuário Desativado"; as avaliações continuam contando na média. A conta é reativada se o usuário fizer login de novo (GP-021).
```gherkin
Dado que tenho picos e avaliações
Quando excluo minha conta informando a senha
Então o usuário é marcado como desativado (nenhum registro é apagado)
E meus picos e avaliações continuam visíveis com autor "Usuário Desativado"
E as médias dos picos não mudam
E meu nome e e-mail não aparecem em nenhuma resposta da API para outros usuários
E o token atual deixa de ser válido (UNAUTHENTICATED)
Dado senha incorreta
Então recebo INVALID_CREDENTIALS e nada muda
```

**GP-074 - Ver e editar perfil (mobile)** | M | MOB | Dep.: GP-071, GP-024
Nova aba/tela de Perfil na TabBar.
```gherkin
Quando abro Perfil
Então vejo nome e e-mail do usuário logado
Quando altero o nome e salvo
Então vejo confirmação e o nome atualizado (inclusive em avaliações futuras)
E loading e erro são tratados
```

**GP-075 - Ver e editar perfil (web)** | M | WEB | Dep.: GP-071, GP-028
Página `/perfil` com o mesmo critério de GP-074.

**GP-076 - Alterar senha (mobile e web)** | S | WEB, MOB | Dep.: GP-072
```gherkin
Quando informo senha atual, nova e confirmação iguais
Então a senha é alterada e vejo confirmação
Quando a confirmação difere
Então vejo erro no campo antes de enviar
```

**GP-077 - Excluir conta (mobile)** | M | MOB | Dep.: GP-073, GP-074
```gherkin
Quando toco em "Excluir conta"
Então vejo aviso claro do que acontece (perfil desativado, picos e avaliações ficam como "Usuário Desativado", reativação ao entrar de novo) e peço a senha
E ao confirmar a sessão encerra e volto ao Login
```

**GP-078 - Excluir conta (web)** | M | WEB | Dep.: GP-073, GP-075
Mesmo critério de GP-077.

**GP-079 - Meus picos e minhas avaliações** | S | BE, WEB, MOB | Dep.: GP-070
Queries `mySpots`/`myReviews` e listas no perfil, com navegação ao detalhe.
```gherkin
Dado que cadastrei 2 picos
Quando abro "Meus picos"
Então vejo os 2 e posso abrir cada um
Dado que não cadastrei nenhum
Então vejo estado vazio com atalho para cadastrar
```

**GP-080 - Foto de perfil (avatar)** | C | BE, WEB, MOB | Dep.: D7

---

## E7 - Qualidade e entrega

**GP-090 - Testes de integração do backend para fluxos do MVP** | M | BE | Dep.: GP-013
Cobrir auth (inclusive recuperação de senha e reativação no login), CRUD de picos (inclusive permissão FORBIDDEN), avaliações (duplicada, nota inválida) e perfil (inclusive desativação de conta).
```gherkin
Quando rodo a suíte
Então todos os cenários de aceite de backend dos épicos E3 a E6 estão cobertos e passam
```

**GP-091 - E2E mobile com Maestro (iOS)** | S | MOB | Dep.: fluxos mobile concluídos
Fluxos: cadastro/login, criar pico, avaliar pico, editar perfil, logout.
```gherkin
Quando executo os fluxos Maestro no simulador iOS
Então todos os fluxos críticos passam
```

**GP-092 - Seed realista (`yarn mock`)** | S | BE | Dep.: GP-016
Usuários, picos com polígonos reais em cidades diferentes e avaliações com nota.

**GP-093 - Checklist de release e build de QA** | S | MOB | Dep.: nenhuma
Checklist local Android/iOS e fluxo do `mobile-qa-build.yml` (APK em `development`) documentados.
```gherkin
Dado o checklist
Quando o orquestrador promove main para development
Então o APK é gerado e o dono consegue instalar e executar o fluxo MVP
```

**GP-094 - Testes de web (sagas/hooks) dos fluxos novos** | S | WEB | Dep.: GP-014

**GP-095 - Moderação, denúncia e picos duplicados** | W | todos | Pós-MVP.
**GP-096 - Verificação de e-mail** | W | todos | Pós-MVP. (Recuperação de senha entrou no MVP: GP-029 e GP-098.)
**GP-097 - Internacionalização (en/es)** | W | WEB, MOB | Pós-MVP.

---

## E8 - Identidade de rua e interação

Pedido do dono (2026-10-23), três diretrizes para **todo** o produto:
1. **Identidade skate de rua:** toda tela/feature passa a ideia de app para skatistas, com grafite, pichação e tags (tipografia de tag em títulos e marca, texturas de muro/concreto/adesivos, ilustrações, estados vazio/erro/loading temáticos, microcopy com gíria de skate em PT-BR, toques no mapa e nos pins), **sem quebrar** as regras de acessibilidade do DS (contraste AA, legível sob sol, nunca só cor).
2. **Bottom sheet no mobile:** no app mobile, todo modal, diálogo, confirmação, menu de ação, seletor ou picker vira bottom sheet com `@gorhom/bottom-sheet`. No web/desktop continua o diálogo (Radix Dialog), como no DS v2, princípio 5; o trabalho no web é aplicar a identidade de grafite aos diálogos existentes (D38, **decidido pelo dono em 2026-10-23**).
3. **Sem sobreposição:** nenhum elemento sobrepõe navegação (tab bar, header, voltar, safe areas, FAB, controles do mapa, toasts) nem outros controles, inclusive em tela pequena, teclado aberto e sheet expandido.

**Fluxo obrigatório:** specs do PO -> UX desenha (GP-102 a GP-107) -> **dono aprova o visual** -> devs. Toda história de dev deste épico depende da história de UX correspondente aprovada pelo dono.

Ordem sugerida: GP-102 e GP-103 -> GP-104 a GP-107 (aprovação do dono) -> bases GP-108 a GP-111 -> migrações para sheet no mobile (GP-112 a GP-114) e diálogos web (GP-115 a GP-117) -> identidade por fluxo (GP-118 a GP-127) -> estados temáticos (GP-128, GP-129). GP-130 e GP-131 (regra e auditoria de sobreposição) podem começar já, em paralelo.

### Inventário (código em `main`, 2026-10-23)

**Telas mobile** (`mobile/src`): Login (`templates/auth/login`), Cadastro (`templates/auth/signup`), Home com mapa, header, busca, filtros, FAB e TabBar (`templates/app/home`, `routes/HomeStack/TabBar`), Detalhe do pico com galeria, mini mapa e avaliações (`templates/app/spotDetails`), Novo pico: local e detalhes (`templates/app/newSpot/location`, `.../details`), Editar pico e Alterar local (`templates/app/editSpot`, `.../location`), Perfil, Editar perfil, Alterar senha, Excluir conta, Meus picos, Minhas avaliações (`templates/app/profile/*`).

**Telas web** (`web/src`): Login `/` (`pages/auth/login`), Cadastro em 3 passos `/cadastro`, `/cadastro/email`, `/cadastro/senha` (`pages/auth/signUp`), Home `/home` com mapa, filtros, resumo do pico e sidebar (`pages/app/home`, `pages/_layouts/AppLayout.tsx`), Novo pico `/spot/new-spot` e `/spot/new-spot/details` (`templates/spot/newSpot`), Detalhe `/spot/:id` (`pages/app/spot/details`), Perfil `/perfil`, `/perfil/senha`, `/perfil/picos`, `/perfil/avaliacoes` (`pages/app/profile`, `pages/_layouts/ProfileLayout.tsx`), Página não encontrada (`pages/error/PageNotFound.tsx`).

**Sobreposições no mobile: 7 a migrar para sheet + 1 a avaliar**
| Hoje | Arquivo | História |
|---|---|---|
| `Alert.alert` descartar novo pico (local) | `templates/app/newSpot/location/useNewSpotLocation.ts` | GP-112 |
| `Alert.alert` descartar novo pico (detalhes) | `templates/app/newSpot/details/useNewSpotDetails.ts` | GP-112 |
| `Alert.alert` descartar edição do pico | `templates/app/editSpot/useEditSpot.ts` | GP-112 |
| `Alert.alert` descartar edição do perfil | `templates/app/profile/edit/useEditProfile.ts` | GP-112 |
| `Alert.alert` sair da conta | `templates/app/profile/useProfileHome.ts` | GP-112 |
| `Alert.alert` descartar avaliação (dentro do sheet de avaliação) | `templates/app/spotDetails/components/ReviewFormSheet.tsx` | GP-112 (D40) |
| `Alert.alert` câmera ou galeria | `templates/app/newSpot/details/pickPhoto.ts` | GP-113 |
| Card flutuante do resumo do pico (`SpotPreview`) sobre o mapa | `templates/app/home/index.tsx` | GP-114 |

Já são sheet (gorhom, só recebem identidade e checagem de sobreposição): sheet de vazio da Home e `FilterSheet` (`templates/app/home`), `ReviewFormSheet`, `DeleteSpotSheet` (PR #177). Componente duplicado a remover: `atomic/molecules/BottomSheetModal` (sem uso) ao lado de `atomic/ds/molecules/BottomSheet` (GP-108). Seletores nativos do sistema (câmera, galeria, permissões) ficam como exceção (D39).

**Diálogos no web: 7 recebem a identidade (continuam diálogo, D38)**
| Hoje | Arquivo | História |
|---|---|---|
| Dialog sair da conta | `pages/_layouts/ProfileLayout.tsx` | GP-115 |
| Modal descartar cadastro de pico (`useBlocker`) | `pages/_layouts/NewSpotLayout.tsx` + `atomic/molecules/modal.tsx` | GP-115 |
| Dialog excluir conta | `pages/app/profile/delete/DeleteAccountDialog.tsx` | GP-115 |
| Dialog de avaliação | `pages/app/spot/details/ReviewDialog.tsx` | GP-116 |
| Painel de filtros (`role="dialog"`) | `pages/app/home/FilterBar.tsx` | GP-117 |
| Dialog "Locais encontrados" | `components/header/PlaceSearch/index.tsx` | GP-117 |
| Visualizador de fotos em tela cheia | `pages/app/spot/details/Gallery.tsx` | GP-117 |

Outros: sidebar vira gaveta (`components/ui/sheet.tsx`) em tela estreita; `beforeunload` nativo em `pages/app/profile/useMyData.ts` e `NewSpotLayout.tsx` (texto controlado pelo navegador, fora do escopo); `atomic/atoms/select.tsx` sem uso; toasts via `sonner` no topo direito (checar sobreposição com o header em GP-131). Nenhum `window.confirm`/`alert` no web.

### Impacto nas issues abertas que criam ou alteram tela
| Issue | Como as diretrizes se aplicam |
|---|---|
| #12 GP-004, #13 GP-005 (aplicar DS no legado) | Passam a mirar o DS v3; boa parte é absorvida por GP-118 a GP-127. Revisar escopo antes de iniciar. |
| #27 GP-025 (logout mobile) | Confirmação de sair em sheet (já existe com `Alert.alert`, migra em GP-112). |
| #30 GP-028 (guard e logout web) | Diálogo de sair com identidade (GP-115). |
| #32 GP-098 (recuperar senha) | Telas com identidade (GP-118/GP-119); sem sobreposição com teclado no campo do código. |
| #44 GP-041 (editar pico web) | Diálogo de descartar com identidade; tela com identidade (GP-123). |
| #47 GP-044 (excluir pico web) | Confirmação em Dialog do DS com identidade (GP-109). |
| #48 GP-045 (excluir pico mobile, PR #177) | Já usa sheet; acrescentar identidade e critério de sobreposição. |
| #51 GP-048 (seletor de camadas mobile) | Seletor vira sheet (variante seletor do GP-108); não pode cobrir FAB nem controles do mapa. |
| #58 GP-066 / #59 GP-067 (editar/excluir avaliação) | Mobile: formulário e confirmação em sheet (D40); web: Dialog com identidade. |
| #72 GP-080 (avatar) | Mobile: escolha câmera/galeria em sheet (reusa GP-113); web: diálogo com identidade. |
| #90 GP-099 (termos) | Aceite e páginas com identidade nos títulos; texto legal sempre em Inter, sem gíria. |
| #173 (login obrigatório) | Tela de login com identidade e sem sobreposição. |
| #175 GP-100 / #176 GP-101 (polígonos por zoom) | Estilo de rua nos polígonos definido em GP-106; aviso de zoom não sobrepõe controles nem sheets. |

### Critérios transversais (valem para toda história de tela do E8 e, a partir de agora, para toda história de tela do backlog)
```gherkin
Cenário: identidade de rua sem perder leitura (CT-ID)
  Dado a tela nos temas claro e escuro
  Então ela aplica os elementos de identidade de rua definidos na spec de UX aprovada (tipografia de tag no título, textura/adesivos, ilustração e microcopy do glossário)
  E todo texto que carrega informação (corpo, rótulos, campos, botões, valores, erros, avisos) segue em Inter com contraste AA (texto >= 4.5:1; ícones e bordas de controle >= 3:1), legível sob sol
  E nenhuma decoração fica atrás de texto informativo, cobre campos ou controles, ou entra na ordem de foco/leitor de tela
  E nenhuma informação é passada só por cor

Cenário: modais viram bottom sheet (CT-SHEET)
  Dado qualquer confirmação, menu de ação, seletor, picker ou formulário sobreposto da tela
  Quando é aberto
  Então aparece como o BottomSheet do DS (GP-108, sobre @gorhom/bottom-sheet), conforme D38 (decidida: sheet no mobile)
  E fecha por arrastar para baixo, toque no fundo, botão fechar e Esc (web), exceto enquanto uma ação está sendo enviada
  E o foco vai para o sheet ao abrir e volta ao gatilho ao fechar; o leitor de tela anuncia o título
  E a tela não usa Alert.alert nem modal centralizado (salvo as exceções da D39)

Cenário: diálogos do web com identidade (CT-DIALOG)
  Dado qualquer confirmação, seletor ou formulário sobreposto da página
  Quando é aberto
  Então usa o Dialog do DS v3 (GP-109, Radix), com a identidade de grafite aprovada (D38: no web continua diálogo)
  E prende o foco, fecha por Esc, toque no fundo e botão (exceto durante envio) e devolve o foco ao gatilho
  E a página não usa window.confirm/alert nem diálogo fora do componente do DS

Cenário: nada sobrepõe a navegação nem outros controles (CT-SOBREP)
  Dado a tela em iPhone SE (375 x 667), Android de 360 x 640 e iPhone com notch/Dynamic Island (mobile) ou em 360, 768 e 1280 px de largura (web)
  Quando a tela está em repouso, com o teclado aberto, com cada bottom sheet (mobile) ou diálogo (web) aberto, inclusive o sheet expandido e com um toast visível
  Então nenhum elemento sobrepõe tab bar, header, botão voltar, FAB, controles do mapa ou toasts
  E nenhum conteúdo ou controle fica sob a status bar, o notch/Dynamic Island ou o home indicator (safe areas respeitadas)
  E nenhum controle fica coberto, cortado ou fora de alcance por outro elemento (alvo de toque de 48 px livre)
  E o campo com foco e o botão principal ficam visíveis acima do teclado
Cenário: fonte do sistema a 130%
  Quando a escala de fonte do sistema/navegador está em 130%
  Então os textos quebram linha sem cortar o essencial e sem invadir controles vizinhos
```
Mobile usa CT-SHEET; web usa CT-DIALOG.

**GP-102 - DS v3: identidade de rua (grafite, pichação, tags) em todo o produto** | M | UX | Dep.: D41, D42, D43
Como skatista, quero que cada tela do GoPicos tenha a cara do skate de rua (tags, grafite, muro, adesivos), para sentir que o app foi feito para mim, sem perder a leitura na rua.
```gherkin
Dado o design-system.md v2 (seção 13, camada de marca restrita a telas de entrada)
Quando o UX publica a v3
Então o DS define, por tipo de tela (entrada, mapa, lista, detalhe, formulário, perfil, sheet, estados), quais elementos de identidade entram e onde (título, cabeçalho, cantos, chips, pins, fundo)
E define a tipografia de tag/grafite para títulos e marca (fonte e/ou lettering em SVG), com tamanho mínimo, comprimento máximo e o que nunca usa a fonte (texto informativo, campos, botões, erros, conteúdo do usuário)
E define texturas vetoriais de muro/concreto/adesivo/fita/spray como tokens/assets leves, com opacidade e posição que não ficam atrás de texto
E define os toques no mapa: estilo dos pins/polígonos e dos controles flutuantes, sem competir com a leitura do mapa
E traz o glossário de microcopy com gíria de skate em PT-BR (onde usar e onde não usar: erros e textos legais ficam claros)
E lista os tokens novos com mapeamento para Tailwind (web) e Tamagui (mobile)
E todo par de cor novo tem contraste AA verificado nos temas claro e escuro
E o dono aprova a prancha de direção no Figma antes de qualquer história de dev da identidade
```
Nota: Revisa a seção 13.6 do DS ("não usar em telas densas"), que conflita com a nova diretriz do dono; o limite fica decidido em D41.

**GP-103 - DS: BottomSheet no mobile, Dialog com identidade no web e mapa de zonas reservadas** | M | UX | Dep.: D38 (decidida), D39, D40
Como skatista usando o celular com uma mão, quero que no app confirmações, menus, seletores e formulários rápidos abram de baixo para cima, para alcançar tudo com o polegar; e no navegador, que os diálogos tenham a mesma identidade.
```gherkin
Dado o componente BottomSheet/Dialog da seção 8 do DS ("dialog no desktop")
Quando o UX publica a atualização
Então o DS define o BottomSheet (@gorhom/bottom-sheet) como padrão de toda sobreposição no mobile (confirmação, menu de ação, seletor/picker, formulário curto, resumo informativo)
E especifica as variantes: confirmação (destrutiva ou não), lista de ações, seletor (única/múltipla escolha), formulário (com teclado) e peek/resumo sobre o mapa
E especifica alturas (snap points), alça, título, botão fechar, rolagem interna, rodapé fixo de ações, fundo escurecido, empilhamento (D40) e comportamento com teclado
E, no web, mantém o Dialog (Radix) do DS v2 (D38) e especifica como a identidade de grafite se aplica a ele (título, textura, adesivo) sem prejudicar leitura e botões
E define o mapa de zonas reservadas por plataforma (status bar, notch/Dynamic Island, home indicator, header, tab bar, FAB, controles do mapa, área de toast) e a regra de z-index entre elas, para que nada sobreponha a navegação
E define acessibilidade: foco preso no sheet, retorno de foco, anúncio do título, fechar por gesto/botão/Esc, reduzir movimento
E lista as exceções aprovadas em D39 (ex.: visualizador de fotos em tela cheia, seletores nativos do sistema)
```

**GP-104 - Ilustrações e estados vazio, erro e loading temáticos** | S | UX | Dep.: GP-102
Como skatista, quero que telas vazias, erros e esperas também falem a língua do skate, para que até o "nada aqui" tenha a cara do app.
```gherkin
Dado a direção aprovada em GP-102
Quando o UX entrega o conjunto
Então existe um set de ilustrações vetoriais leves (ex.: shape quebrado, cone, muro com tag, rolamento) para vazio, erro de rede, erro genérico, não encontrado e sucesso
E existe um loader temático (ex.: roda/shape girando) que respeita "reduzir movimento"
E cada estado tem título, texto e ação com microcopy do glossário, e o texto de erro diz claramente o que aconteceu e o que fazer
E as ilustrações são decorativas (aria-hidden), não carregam informação sozinhas e não empurram a ação principal para fora da tela em 375 x 667
E o dono aprova o conjunto antes de GP-128/GP-129
```

**GP-105 - Specs: autenticação e perfil com identidade de rua e sheets** | M | UX | Dep.: GP-102, GP-103
Como dev, quero as specs de login, cadastro, recuperar senha, termos e perfil atualizadas com a identidade de rua, os sheets e as zonas reservadas, para implementar sem adivinhar.
```gherkin
Dado as specs autenticacao.md e perfil.md
Quando o UX publica a atualização
Então cada tela tem frames mobile (375 x 667 e com notch) e web (360, 768 e 1280), claro e escuro, com a identidade aplicada
E toda confirmação/seletor desses fluxos aparece como sheet no mobile e como Dialog com identidade no web (sair, descartar edição do perfil, excluir conta, escolha de foto do avatar quando existir)
E cada frame marca as zonas reservadas e mostra o estado com teclado aberto e com sheet expandido
E o dono aprova os frames antes de GP-115 e das histórias de identidade de autenticação e perfil
```

**GP-106 - Specs: mapa (Home), criar e editar pico com identidade de rua e sheets** | M | UX | Dep.: GP-102, GP-103
Como dev, quero as specs da Home com mapa e do cadastro/edição de pico atualizadas com identidade, sheets e zonas reservadas, para implementar sem sobreposição no mapa.
```gherkin
Dado as specs picos.md e picos-fechamento.md
Quando o UX publica a atualização
Então a Home define pins/polígonos e controles no estilo de rua, no mobile o resumo do pico como sheet (peek) e busca/filtros/camadas como sheets; no web, filtros e busca de lugar com a identidade aplicada
E define as posições de FAB, controles do mapa, header, tab bar, toast e sheet aberto sem que um cubra o outro, em 375 x 667 e 360 x 640
E criar/editar pico define confirmações de descarte e escolha de foto (câmera/galeria) como sheets no mobile e diálogos com identidade no web
E cada frame mostra teclado aberto e sheet expandido
E o dono aprova os frames antes de GP-113, GP-114, GP-117 e das histórias de identidade de mapa e criar/editar pico
```

**GP-107 - Specs: detalhe do pico e avaliações com identidade de rua e sheets** | M | UX | Dep.: GP-102, GP-103
Como dev, quero as specs do detalhe do pico e das avaliações atualizadas com identidade, sheets e zonas reservadas, para implementar avaliar/editar/excluir de forma consistente.
```gherkin
Dado a spec de detalhe e avaliações (picos.md 9A e picos-fechamento.md 10)
Quando o UX publica a atualização
Então o detalhe aplica a identidade (título de tela, chips como sticker, cabeçalho) sem usar a fonte de tag no nome do pico nem no texto das avaliações (conteúdo do usuário)
E o formulário de avaliação, a confirmação de excluir avaliação, a de excluir pico e o menu de ações do autor são sheets no mobile e Dialogs com identidade no web (D38)
E a confirmação de descarte de uma avaliação em edição segue a regra de empilhamento da D40
E cada frame mostra teclado aberto com o sheet de avaliação e o botão Enviar visível
E o dono aprova os frames antes de GP-116 e das histórias de identidade do detalhe do pico
```

**GP-108 - BottomSheet base do DS v3 (mobile)** | M | MOB | Dep.: GP-103 aprovada pelo dono
Como dev mobile, quero um BottomSheet único do DS sobre @gorhom/bottom-sheet com todas as variantes, para migrar qualquer modal sem reinventar comportamento.
```gherkin
Dado a spec do BottomSheet aprovada (GP-103)
Quando o componente é entregue em atomic/ds
Então cobre as variantes confirmação, lista de ações, seletor, formulário com teclado e peek, usando só tokens do DS
E respeita safe areas e fica acima da tab bar e do home indicator, sem cobrir o FAB nem os controles do mapa quando em peek
E com teclado aberto o campo com foco e o rodapé de ações ficam visíveis
E fecha por gesto, toque no fundo e botão; bloqueia o fechamento durante envio
E anuncia o título ao leitor de tela e respeita "reduzir movimento"
E existe um único componente de sheet no app (o duplicado atomic/molecules/BottomSheetModal é removido ou absorvido)
E há testes unitários das variantes e do bloqueio durante envio
```
Critérios transversais: CT-SOBREP (ver início do épico).

**GP-109 - Dialog do DS v3 no web (identidade de grafite e zonas reservadas)** | M | WEB | Dep.: GP-103 aprovada pelo dono; GP-111
Como dev web, quero um Dialog único do DS com a identidade de grafite, para aplicar o mesmo visual a todos os diálogos existentes.
```gherkin
Dado a decisão D38 (web mantém o Dialog Radix, como no DS v2, princípio 5) e a spec aprovada em GP-103
Quando o componente é entregue em atomic/
Então existe um único Dialog do DS (unificando components/ui/dialog e atomic/molecules/modal.tsx) sobre @radix-ui/react-dialog, com as variantes confirmação, formulário e lista/seletor
E aplica a identidade v3 (título com tipografia de tag quando a spec pedir, textura/adesivo decorativo fora da área de texto e dos botões), usando só tokens
E abaixo de 640 px segue o comportamento já definido no DS v2 para tela estreita
E prende o foco, fecha por Esc, toque no fundo e botão (bloqueado durante envio), devolve o foco ao gatilho e anuncia o título (aria-modal, aria-labelledby)
E respeita env(safe-area-inset-*) no navegador do celular e prefers-reduced-motion
E há testes (Vitest) de abrir/fechar, foco e bloqueio durante envio
```
Critérios transversais: CT-ID, CT-SOBREP (ver início do épico).

**GP-110 - Fundação da identidade v3 no mobile (tokens, fontes, texturas, componentes de marca)** | M | MOB | Dep.: GP-102 aprovada pelo dono
Como dev mobile, quero os tokens, fontes, assets vetoriais e componentes de marca da v3 prontos no DS, para aplicar a identidade nas telas sem estilo ad-hoc.
```gherkin
Dado o DS v3 aprovado (GP-102)
Quando a fundação é entregue
Então os tokens novos existem no tema Tamagui (claro e escuro) e as fontes/lettering de tag estão nos assets nativos (iOS e Android)
E os componentes de marca da v3 (ex.: título de tag, textura de muro, adesivo, fita, spray) existem em atomic/ds, decorativos e ocultos do leitor de tela
E nenhum asset é raster pesado; o peso somado segue o limite definido no DS
E há uma tela/história de exemplo ou teste de renderização dos componentes
```

**GP-111 - Fundação da identidade v3 no web (tokens, fontes, texturas, componentes de marca)** | M | WEB | Dep.: GP-102 aprovada pelo dono
Como dev web, quero os tokens, fontes, assets vetoriais e componentes de marca da v3 prontos no DS, para aplicar a identidade nas páginas sem estilo ad-hoc.
```gherkin
Dado o DS v3 aprovado (GP-102)
Quando a fundação é entregue
Então os tokens novos existem no Tailwind (claro e escuro) e as fontes carregam com font-display: swap
E os componentes de marca da v3 existem em atomic/, decorativos (aria-hidden) e fora da ordem de foco
E nenhum asset é raster pesado; o peso somado segue o limite definido no DS
E yarn build e yarn lint passam
```

**GP-112 - Confirmações em bottom sheet no mobile (fim do Alert.alert)** | M | MOB | Dep.: GP-108; GP-105, GP-106 e GP-107 aprovadas
Como skatista, quero confirmar sair, descartar ou excluir num sheet do app, e não num alerta do sistema, para ter a mesma experiência em todo lugar e alcançar os botões com o polegar.
```gherkin
Dado as confirmações que hoje usam Alert.alert: descartar novo pico (local e detalhes), descartar edição do pico, descartar edição do perfil, sair da conta e descartar avaliação em edição
Quando cada uma é disparada
Então aparece como sheet de confirmação do DS, com título, texto e ações iguais às da spec, ação destrutiva destacada e "Cancelar"
E o descarte de avaliação, que nasce dentro do sheet de avaliação, segue a regra de empilhamento da D40
E o voltar do Android e o gesto de voltar do iOS abrem a mesma confirmação quando há dados
E não resta nenhum Alert.alert em mobile/src
E os testes das telas afetadas cobrem confirmar e cancelar
```
Critérios transversais: CT-SHEET, CT-SOBREP (ver início do épico).

**GP-113 - Escolha de foto (câmera ou galeria) em bottom sheet no mobile** | M | MOB | Dep.: GP-108; GP-106 aprovada
Como skatista cadastrando um pico, quero escolher entre câmera e galeria num sheet do app, para adicionar fotos com uma mão.
```gherkin
Dado o PhotoPicker de criar e editar pico (hoje Alert.alert em pickPhoto.ts)
Quando toco em adicionar foto
Então abre um sheet de ações com "Tirar foto", "Escolher da galeria" e "Cancelar"
E ao escolher, abre a câmera ou a galeria do sistema (telas nativas do sistema são exceção da D39)
E permissão negada mostra explicação clara com atalho para os ajustes
E o mesmo componente fica disponível para o avatar (GP-080), se entrar
```
Critérios transversais: CT-SHEET, CT-SOBREP (ver início do épico).

**GP-114 - Resumo do pico no mapa como sheet (peek) no mobile** | S | MOB | Dep.: GP-108; GP-106 aprovada
Como skatista explorando o mapa, quero que o resumo do pico suba de baixo como sheet, para ver o pico sem perder a tab bar, o FAB e os controles do mapa.
```gherkin
Dado a Home com o SpotPreview hoje flutuando sobre o mapa
Quando toco num pico
Então o resumo abre como sheet em altura peek, acima da tab bar, sem cobrir o FAB nem os controles do mapa (ou com o FAB reposicionado conforme a spec)
E arrastar para cima expande e mostra "Ver detalhes"; arrastar para baixo ou tocar no mapa fecha
E tocar em outro pico troca o conteúdo sem fechar e reabrir
E o sheet de estado vazio e o de filtros continuam funcionando sem um ficar sobre o outro
```
Critérios transversais: CT-SHEET, CT-SOBREP (ver início do épico).

**GP-115 - Identidade de grafite nos diálogos de confirmação do web (sair, descartar cadastro, excluir conta)** | M | WEB | Dep.: GP-109; GP-105 e GP-106 aprovadas
Como skatista no navegador, quero que as confirmações também tenham a cara do skate de rua, sem perder a clareza do que vai acontecer.
```gherkin
Dado os diálogos atuais: sair (ProfileLayout), descartar cadastro de pico (NewSpotLayout, Modal) e excluir conta (DeleteAccountDialog)
Quando cada um é aberto
Então usa o Dialog do DS v3 (GP-109) com a identidade aprovada, mantendo conteúdo, validações e estados de envio/erro
E a consequência da ação (ex.: "não pode ser desfeita") e os botões continuam em Inter, com a ação destrutiva destacada sem depender só de cor
E excluir conta mantém o campo de senha e o erro dentro do diálogo, que não fecha durante o envio
E os testes existentes continuam passando
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-116 - Identidade de grafite no diálogo de avaliação do web** | M | WEB | Dep.: GP-109; GP-107 aprovada
Como skatista avaliando um pico no navegador, quero que o formulário de estrelas e comentário tenha a cara do app, sem atrapalhar a escrita.
```gherkin
Dado o ReviewDialog atual em /spot/:id (e editar avaliação, quando GP-067 existir)
Quando abro o formulário
Então ele usa o Dialog do DS v3 com a identidade aprovada, com foco inicial na 1a estrela e contador 0/500
E fechar com dados preenchidos continua pedindo confirmação
E em 360 px com o teclado virtual aberto o botão Enviar fica visível
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-117 - Identidade de grafite no painel de filtros, na busca de lugar e no visualizador de fotos do web** | S | WEB | Dep.: GP-109; GP-106 aprovada
Como skatista no navegador, quero que filtros, a lista de lugares e o visualizador de fotos sigam a mesma identidade dos demais diálogos.
```gherkin
Dado o painel de filtros (FilterBar), o dialog "Locais encontrados" da busca de lugar e o visualizador de fotos (Gallery)
Quando cada um é aberto
Então usa o Dialog/painel do DS v3 com a identidade aprovada, sem cobrir o header nem os controles do mapa no estado fechado
E aplicar, limpar e escolher lugar mantêm o comportamento atual (centralizar o mapa, chips de filtros ativos)
E no visualizador de fotos a decoração não cobre a foto nem os controles de navegar/fechar
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-118 - Identidade de rua no mobile: autenticação** | M | MOB | Dep.: GP-110; GP-105 aprovada
Como skatista, quero que entrar e criar conta tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas Login, Cadastro (passos) e Recuperar senha (quando GP-098 existir)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E o título de cada tela usa a tipografia de tag e a microcopy do glossário, e mensagens de erro continuam claras e em Inter
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-SHEET, CT-SOBREP (ver início do épico).

**GP-119 - Identidade de rua no web: autenticação** | M | WEB | Dep.: GP-111; GP-105 aprovada
Como skatista, quero que entrar e criar conta tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas / (login), /cadastro, /cadastro/email, /cadastro/senha e recuperar senha (quando GP-098 existir)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E o título de cada página usa a tipografia de tag e a microcopy do glossário, e mensagens de erro continuam claras e em Inter
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-120 - Identidade de rua no mobile: mapa (Home)** | M | MOB | Dep.: GP-110; GP-106 aprovada
Como skatista, quero que o mapa de picos tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas Home (mapa, header com busca e filtros, pins/polígonos, FAB, tab bar)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E pins/polígonos, FAB e tab bar seguem o estilo de rua da spec sem perder a leitura do mapa nem a distinção de pico selecionado (que não depende só de cor)
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-SHEET, CT-SOBREP (ver início do épico).

**GP-121 - Identidade de rua no web: mapa (Home)** | M | WEB | Dep.: GP-111; GP-106 aprovada
Como skatista, quero que o mapa de picos tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas /home (mapa, header, busca, filtros, pins/polígonos, sidebar)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E pins/polígonos e controles seguem o estilo de rua da spec sem perder a leitura do mapa nem a distinção de pico selecionado (que não depende só de cor)
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-122 - Identidade de rua no mobile: criar e editar pico** | S | MOB | Dep.: GP-110; GP-106 aprovada
Como skatista, quero que cadastrar e editar um pico tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas NewSpotLocation, NewSpotDetails, EditSpot e EditSpotLocation
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E a decoração fica fora da área do formulário e não aumenta a rolagem; campos e botões seguem limpos
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-SHEET, CT-SOBREP (ver início do épico).

**GP-123 - Identidade de rua no web: criar e editar pico** | S | WEB | Dep.: GP-111; GP-106 aprovada; #44 (GP-041)
Como skatista, quero que cadastrar e editar um pico tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas /spot/new-spot, /spot/new-spot/details e editar pico (/spot/:id/edit, GP-041)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E a decoração fica fora da área do formulário e não aumenta a rolagem; campos e botões seguem limpos
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-124 - Identidade de rua no mobile: detalhe do pico e avaliações** | M | MOB | Dep.: GP-110; GP-107 aprovada
Como skatista, quero que o detalhe do pico tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas SpotDetails (galeria, informações, mini mapa, avaliações e sheet de avaliação)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E chips de modalidade aparecem como sticker; nome do pico e texto das avaliações (conteúdo do usuário) continuam em Inter
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-SHEET, CT-SOBREP (ver início do épico).

**GP-125 - Identidade de rua no web: detalhe do pico e avaliações** | M | WEB | Dep.: GP-111; GP-107 aprovada
Como skatista, quero que o detalhe do pico tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas /spot/:id (galeria, informações, mini mapa, avaliações e sheet de avaliação)
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E chips de modalidade aparecem como sticker; nome do pico e texto das avaliações (conteúdo do usuário) continuam em Inter
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-126 - Identidade de rua no mobile: perfil** | S | MOB | Dep.: GP-110; GP-105 aprovada
Como skatista, quero que o meu perfil tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas ProfileHome, ProfileEdit, ChangePassword, DeleteAccount, MySpots e MyReviews
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E iniciais/avatar e contagens seguem o estilo de rua (ex.: sticker), com números legíveis
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-SHEET, CT-SOBREP (ver início do épico).

**GP-127 - Identidade de rua no web: perfil e página não encontrada** | S | WEB | Dep.: GP-111; GP-105 aprovada
Como skatista, quero que o meu perfil tenha a cara do skate de rua, para sentir que estou num app feito para a minha cena.
```gherkin
Dado as telas /perfil, /perfil/senha, /perfil/picos, /perfil/avaliacoes e a página 404
Quando a identidade v3 é aplicada conforme a spec aprovada
Então cada tela usa os componentes de marca e tokens da v3, sem hex, fonte ou raio literal
E iniciais/avatar e contagens seguem o estilo de rua (ex.: sticker), com números legíveis
E o comportamento das telas não regride (testes existentes passam)
```
Critérios transversais: CT-ID, CT-DIALOG, CT-SOBREP (ver início do épico).

**GP-128 - Estados vazio, erro e loading temáticos no mobile** | S | MOB | Dep.: GP-104 aprovada; GP-110
Como skatista, quero que listas vazias, erros e esperas tenham ilustração e texto com a cara do skate, para não cair numa tela genérica.
```gherkin
Dado os estados de vazio, erro, sem conexão, não encontrado e loading das telas mobile (EmptyState, sheet de vazio da Home, Meus picos, Minhas avaliações, avaliações do pico, detalhe não encontrado)
Quando cada estado aparece
Então usa a ilustração e a microcopy aprovadas em GP-104, com a ação principal visível sem rolar em 375 x 667
E erros continuam dizendo claramente o que aconteceu e oferecendo "Tentar novamente"
E o loader temático respeita "reduzir movimento"; listas mantêm skeleton
```
Critérios transversais: CT-ID, CT-SOBREP (ver início do épico).

**GP-129 - Estados vazio, erro e loading temáticos no web** | S | WEB | Dep.: GP-104 aprovada; GP-111
Como skatista no navegador, quero que listas vazias, erros e esperas tenham ilustração e texto com a cara do skate, para não cair numa página genérica.
```gherkin
Dado os estados de vazio, erro, sem conexão, não encontrado (inclusive a página 404 e "Pico não encontrado") e loading das páginas web
Quando cada estado aparece
Então usa a ilustração e a microcopy aprovadas em GP-104, com a ação principal visível sem rolar em 360 px de largura
E erros continuam dizendo claramente o que aconteceu e oferecendo "Tentar novamente"
E o loader temático respeita prefers-reduced-motion; listas mantêm skeleton
```
Critérios transversais: CT-ID, CT-SOBREP (ver início do épico).

**GP-130 - Regra transversal "sem sobreposição" na DoD, no checklist do QA e do UX** | M | WEB, MOB | Dep.: aprovação do dono (PR do backlog E8)
Como dono do produto, quero que toda entrega de tela seja checada contra sobreposição de elementos, para que nada cubra a navegação ou outros controles em nenhum celular.
```gherkin
Dado o texto proposto pelo PO no PR do E8
Quando o dono aprova
Então a Definition of Done do CLAUDE.md inclui o item de identidade, sheet e sobreposição
E o checklist do QA (.claude/agents/qa.md) exige verificar sobreposição na matriz de dispositivos (iPhone SE 375 x 667, Android 360 x 640, iPhone com notch/Dynamic Island; web 360, 768 e 1280), com teclado aberto, sheet expandido, toast visível e fonte a 130%, anexando prints no parecer
E o checklist do UX (.claude/agents/ux.md) exige identidade de rua, sobreposições como sheet e zonas reservadas marcadas em cada frame
E o parecer do QA que encontrar sobreposição é "QA: MUDANÇAS NECESSÁRIAS"
```

**GP-131 - Auditoria de sobreposição nas telas existentes (web e mobile)** | M | WEB, MOB | Dep.: GP-130
Como dono do produto, quero saber hoje onde algo cobre a navegação ou outros controles, para corrigir antes de entregar o MVP.
```gherkin
Dado todas as telas listadas no inventário do E8 (mobile e web)
Quando o QA percorre cada uma na matriz de dispositivos da GP-130, com teclado aberto, cada sheet expandido e toast visível
Então cada sobreposição encontrada vira uma issue de bug com print, dispositivo, passos e a regra violada, adicionada ao Project em Backlog
E a auditoria registra as telas sem problema
E itens suspeitos do inventário são verificados: SpotPreview e sheet de vazio sobre a tab bar/FAB na Home mobile, toast sobre o header, painel de filtros web em 360 px, botão "Salvar alterações" acima do teclado no editar pico mobile
```

---

## Decisões do dono

Decididas em 2026-10-22. D1 e D4 foram alteradas pelo dono; D1–D13 seguem a recomendação do PO nos demais itens. D14–D17 vieram da spec de autenticação (PR #89). D18–D26 (spec de picos, PR #112) e D30–D37 (spec de perfil, PR #114) foram aprovadas pelo dono em 2026-10-22, junto com os protótipos das telas, seguindo a recomendação do UX.

| # | Decisão | Decisão final |
|---|---|---|
| D1 | Recuperação de senha e verificação de e-mail no MVP? | **Recuperação de senha entra no MVP** (GP-017, GP-029, GP-098), por código de 6 dígitos enviado por e-mail. Verificação de e-mail continua fora (GP-096). |
| D2 | Regra de avaliação: uma por usuário por pico? | Sim, uma por usuário por pico, editável/excluível. Fora do MVP: respostas e curtidas. |
| D3 | Comentário obrigatório? Manter campo `title`? | Estrelas obrigatórias; comentário opcional (até 500 caracteres); remover `title`. Respostas (`parentId`) ficam fora do MVP. |
| D4 | O que acontece com picos e avaliações ao excluir a conta? | **"Excluir conta" nunca apaga o usuário do banco, só desativa.** Picos e avaliações continuam visíveis com autor "Usuário Desativado" e as avaliações seguem contando na média. Login com a senha correta reativa a conta. |
| D5 | O autor do pico pode avaliar o próprio pico? | Não, para manter a nota confiável. |
| D6 | `Spot.modality` é texto livre. Lista fechada? | Lista fechada (ex.: street, park, bowl/pool, vertical, downhill, mista). O dono/UX confirma a lista. |
| D7 | Perfil: editar e-mail e avatar? | MVP edita só o nome; e-mail imutável (é o login); avatar é Could (GP-080). O `nickname` do input de signup será removido (não existe no modelo). |
| D8 | Duração da sessão (JWT)? | 7 dias sem refresh token; ao expirar, volta ao login. |
| D9 | Limites de fotos por pico e tamanho? | Mínimo 1 e máximo 5 fotos por pico, até 5 MB cada. |
| D10 | Visitante sem conta pode ver o mapa? | Não no MVP: todo o conteúdo exige login (como hoje, `@Authenticated`). Leitura pública fica para depois. |
| D11 | Plataformas mobile do MVP: iOS e Android? | Ambos compilam e funcionam; validação E2E (Maestro) e critério de aceite principal no iOS; APK Android para teste do dono via `development`. |
| D12 | Idioma do app | pt-BR no MVP, textos centralizados para i18n futuro (GP-097). |
| D13 | Qualquer usuário pode editar fotos/dados de qualquer pico (wiki) ou só o autor? | Só o autor (regra atual do time). Colaboração aberta e moderação ficam pós-MVP. |
| D14 | Avisar quando a conta desativada é reativada no login? | Sim: login devolve `reactivated` e o app mostra "Bem-vindo de volta! Sua conta foi reativada." |
| D15 | Após o cadastro o usuário entra logado? | Não: volta ao Login com o e-mail preenchido e aviso de conta criada. |
| D16 | Espera no "Reenviar código" da recuperação de senha? | Sim, 30 segundos entre envios. |
| D17 | Termos de uso e política de privacidade no MVP? | Sim (GP-099), aceite obrigatório no cadastro. |
| D18 | Campo "equipamento" do pico | "Exige proteção" (e não "tem equipamento no local"). |
| D19 | Valor da entrada paga | Texto livre. |
| D20 | Busca no mapa | Só por lugar no MVP; busca de picos por nome fica para depois. |
| D21 | Filtro por nota mínima | Pedir `minRating` ao backend (GP-030); se custar muito, o filtro sai do MVP. |
| D22 | Editar o polígono depois de criado | Sim, por "Alterar local". |
| D23 | Limites de texto do pico | Nome até 80 caracteres; descrição até 1000. |
| D24 | Rascunho do cadastro de pico se a sessão expirar | Aceita-se perder os dados no MVP. |
| D25 | TabBar | Só Mapa e Perfil; criar pico fica num botão flutuante (FAB). |
| D26 | Confirmar antes de excluir a própria avaliação | Sim, confirmação curta. |
| D30 | Foto de perfil no MVP | Não: só iniciais; envio de foto (GP-080) fica fora do MVP. |
| D31 | Paginação em "meus picos" e "minhas avaliações" | Não no MVP: lista completa. |
| D32 | Confirmação extra ao excluir a conta, além da senha | Não (a exclusão é reversível pela reativação). |
| D33 | Alterar senha encerra outras sessões | Mantém a sessão atual; invalidar tokens anteriores só se o backend suportar. |
| D34 | Aviso no Login após excluir a conta | Sim. |
| D35 | Contagens de picos e avaliações no perfil | Sim: `me` passa a devolver `spotsCount` e `reviewsCount`. |
| D36 | Nome do autor em contextos públicos | "Nome S." (nome e inicial do sobrenome). |
| D37 | Limite do nome no perfil | 40 caracteres para o nome e 40 para o sobrenome (como no cadastro, GP-081). |
| D38 | Modais: bottom sheet em todo lugar? | **Decidido pelo dono em 2026-10-23:** no app mobile, todo modal, diálogo, confirmação, menu de ação ou picker vira bottom sheet com `@gorhom/bottom-sheet`. No web/desktop continua o diálogo (Radix Dialog), como no DS v2, princípio 5; no web o trabalho é aplicar a identidade de grafite aos diálogos existentes. |
| D39 | Exceções à regra "todo modal vira sheet" no mobile | **Decidido pelo dono em 2026-10-23 (recomendação do PO):** Ficam fora: telas nativas do sistema (câmera, galeria, pedidos de permissão, compartilhar), toasts (não são modais), sugestões da busca de lugar (lista inline sob o campo, para não esconder o mapa) e um visualizador de fotos em tela cheia, se existir. Todo o resto vira sheet. |
| D40 | Confirmação que nasce dentro de um sheet (ex.: descartar avaliação em edição) | **Decidido pelo dono em 2026-10-23 (recomendação do PO):** Não empilhar dois sheets: a confirmação troca o conteúdo do mesmo sheet ("Descartar avaliação?" com "Descartar" e "Continuar editando"). Evita sheet sobre sheet e sobreposição. |
| D41 | Alcance da identidade: o DS v2 (seção 13.6) proíbe a camada de marca em telas densas (mapa, detalhe, lista) | **Decidido pelo dono em 2026-10-23 (recomendação do PO):** Liberar em todas as telas com limites: tipografia de tag só em títulos fixos de tela e marca (nunca em conteúdo do usuário, como nome do pico ou avaliação, nem em campos, botões, erros); textura e adesivos nos cabeçalhos, cantos e estados vazios; no mapa, só pins/polígonos e controles estilizados, sem textura sobre o mapa. |
| D42 | Tom da microcopy com gíria de skate | **Decidido pelo dono em 2026-10-23 (recomendação do PO):** Glossário curto aprovado pelo dono (ex.: "pico", "rolê", "sessão", "dropar", "colar no pico"), usado em títulos, vazios, sucessos e convites. Erros, segurança, exclusão de conta e textos legais continuam diretos e sem gíria. |
| D43 | Tipografia de tag | **Decidido pelo dono em 2026-10-23 (recomendação do PO):** Manter Permanent Marker (legível) para títulos; o lettering mais "tag/pichação" entra só como arte vetorial na marca, ilustrações e adesivos, nunca como fonte de texto. |


## Resumo de priorização
Total: 103 histórias - Must 74, Should 23, Could 2, Won't 4 (atualizar ao alterar o backlog). E8 (2026-10-23): 30 histórias - Must 21, Should 9.
