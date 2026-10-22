# GoPicos

Plataforma para skatistas do mundo todo cadastrarem "picos" (locais para andar de skate) e avaliá-los com estrelas e comentários.

**Objetivo atual: finalizar o MVP** — login e cadastro, CRUD de picos (com avaliação por estrelas + comentários) e CRUD do perfil do usuário logado, em backend, web e mobile.

Idioma de trabalho: **português** (código em inglês, mas commits, PRs, issues, docs e comentários de revisão em português).

## Monorepo

| Pasta | Stack | Comandos |
|---|---|---|
| `backend/` | Node + TypeScript, Apollo Server (GraphQL) sobre Express, Prisma + Postgres, Cloudinary (imagens), JWT | `yarn dev`, `yarn build`, `yarn migrate`, `yarn generate`, `yarn mock` (seed) |
| `web/` | React + Vite + TS, Tailwind + Radix (shadcn, `components.json`), Redux Toolkit + Redux-Saga, Apollo Client, react-hook-form + yup, Mapbox (`react-map-gl`) | `yarn dev`, `yarn build`, `yarn lint`, `yarn generate` (plop scaffolds) |
| `mobile/` | React Native 0.85 (New Arch) + TS, Tamagui + styled-components, React Navigation, Redux Toolkit + Redux-Saga, Apollo Client, `@rnmapbox/maps`, Keychain para token | `yarn ios`, `yarn android`, `yarn start`, `yarn test`, `yarn lint` |

Banco local: `docker-compose up database` na raiz (Postgres, credenciais em `.env`). Ignorar o repositório `../gopicos-backend` (legado).

### Arquitetura
- **Backend:** cada operação GraphQL vive em `src/graphql/modules/<domínio>/<operação>/schema.graphql` e segue o fluxo `resolver → controller → service → repository (database/repositories)`, com `models/` (shape de saída) e `dtos/`. Schema Prisma em `src/prisma/schema.prisma`.
- **Web e mobile:** atomic design (`atomic/atoms`, `atomic/molecules`, `components/`, `templates/`), estado em `store/<domínio>/<feature>/` (slice + sagas + repository + queries + types).
- Coordenadas de picos são polígonos **GeoJSON em ordem `[lng, lat]`**.
- Mobile: Android emulator acessa o backend por `10.0.2.2`, iOS simulator por `localhost` (`mobile/src/config/apollo.ts`).

## Fluxo de trabalho

- Tarefas no **GitHub Projects** (repo `AndreiAmr/gopicos`). Cada tarefa = uma issue.
- **Uma branch por tarefa a partir de `main`**: `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<slug>`.
- Dev commita e faz push sozinho, abre PR para `main` referenciando a issue (`Closes #N`). QA revisa e aprova ou devolve.
- **`development` é exclusiva para gerar APK** de teste em dispositivo físico (workflow `mobile-qa-build.yml`). Nunca abrir PR de feature para ela; só o orquestrador faz merge de `main` → `development` quando houver entrega para o dono testar.
- Commits no padrão Conventional Commits, em português: `feat(mobile): ...`, `fix(backend): ...`.
- Nunca commitar `.env`, segredos ou `console.log` de debug.

## Definition of Done (toda tarefa)
1. Critérios de aceite da issue atendidos.
2. `yarn lint` e build/type-check passando no(s) pacote(s) alterado(s), sem erros novos.
3. Testes da tarefa escritos e passando (ver Estratégia de testes).
4. Estados de loading, vazio e erro tratados nas telas.
5. Segue o design system e a spec de UX da tarefa.
6. PR aprovado pelo QA.

## Estratégia de testes
- **Backend:** testes de integração dos resolvers/serviços com Jest contra o Postgres local (seed via `yarn mock`).
- **Web/Mobile:** testes unitários de hooks, sagas e lógica com Jest.
- **E2E mobile:** fluxos críticos (login, cadastro, criar/editar pico, avaliar) com Maestro no iOS simulator.
- Validação manual pelo QA no simulador/browser contra os critérios de aceite.

## Time de agentes (`.claude/agents/`)
`po` (backlog e critérios de aceite) → `pm` (planejamento, GitHub Projects) → `ux` (design system, specs, Figma) → `dev` (implementação) → `qa` (revisão de PR e testes). O agente principal orquestra; o dono do produto aprova **somente o backlog e a entrega final**.

Documentos do time ficam em `docs/`: `docs/produto/` (visão, backlog), `docs/planejamento/` (roadmap/sprints), `docs/design/` (design system e specs de tela).
