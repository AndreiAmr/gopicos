# GoPicos - Backlog do MVP

Fonte única do backlog (substitui `mobile/PLANO_DE_ACAO.md`). IDs `GP-xxx` são estáveis; não renumerar. Prioridade MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (neste MVP). Plataformas: BE = backend, WEB, MOB.

Convenções de regra de negócio (valem para todas as histórias):
- Operações de escrita exigem usuário autenticado; a identidade vem **sempre do token**, nunca do input.
- Somente o autor edita/exclui o próprio pico e a própria avaliação.
- Erros devolvem `type` + `message` em pt-BR (padrão `AppError`); telas mostram mensagem amigável, nunca texto técnico.
- Coordenadas: polígono GeoJSON em `[lng, lat]`.

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

Ordem sugerida: E1 e E2 em paralelo -> E3 -> E4 e E6 (BE) -> E5 -> E7. Fatiamento de telas segue o design system quando disponível; até lá, Dev implementa BE e lógica (hooks/store) e telas com estilo provisório.

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
Códigos estáveis (`INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `UNAUTHENTICATED`) e função única nos clientes que os traduz em mensagem para o usuário.
```gherkin
Dado um erro conhecido do backend
Quando o cliente o recebe
Então exibe a mensagem amigável correspondente; para erro desconhecido ou de rede exibe mensagem genérica com opção de tentar novamente
```

**GP-016 - Modelo de dados: preparar migrations do MVP** | M | BE | Dep.: decisões D2, D4, D6, D10
Migration única e coordenada: rating em `SpotReview`, remoção/ajuste de `title`, unicidade (autor, pico), `onDelete` conforme regra de exclusão de conta, enum de modalidade, índices.
```gherkin
Quando rodo yarn migrate em banco existente
Então as migrations aplicam sem perda de dados dos picos atuais
E o seed (yarn mock) gera avaliações com nota
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
Então a conta é criada e entro autenticado (ou sou levado ao Login com aviso de sucesso)
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
Então a conta é criada e sou autenticado
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
Quando envio nome válido (não vazio, até 60 caracteres)
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

**GP-073 - Excluir conta (backend)** | M | BE | Dep.: GP-070, D4
Regra recomendada: ao excluir a conta, as avaliações do usuário são removidas; os picos são mantidos e passam a exibir autor "Usuário removido".
```gherkin
Dado que tenho picos e avaliações
Quando excluo minha conta informando a senha
Então o usuário é removido, minhas avaliações são excluídas e as médias recalculadas
E meus picos permanecem sem vínculo com meus dados pessoais
E o token deixa de ser válido
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
Então vejo aviso claro do que será apagado e peço a senha
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
Cobrir auth, CRUD de picos (inclusive permissão FORBIDDEN), avaliações (duplicada, nota inválida) e perfil (inclusive exclusão de conta).
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
**GP-096 - Recuperação de senha e verificação de e-mail** | W | todos | Pós-MVP.
**GP-097 - Internacionalização (en/es)** | W | WEB, MOB | Pós-MVP.

---

## Decisões pendentes do dono

| # | Decisão | Recomendação do PO |
|---|---|---|
| D1 | Recuperação de senha e verificação de e-mail no MVP? | Fora do MVP (GP-096). Aceitar o risco de contas com e-mail digitado errado. |
| D2 | Regra de avaliação: uma por usuário por pico? | Sim, uma por usuário por pico, editável/excluível. Fora do MVP: respostas e curtidas. |
| D3 | Comentário obrigatório? Manter campo `title`? | Estrelas obrigatórias; comentário opcional (até 500 caracteres); remover `title`. Respostas (`parentId`) ficam fora do MVP. |
| D4 | O que acontece com picos e avaliações ao excluir a conta? | Avaliações removidas; picos preservados com autor "Usuário removido" (valor comunitário). Exige `authorId` anulável ou usuário "removido" (decisão técnica do Dev). |
| D5 | O autor do pico pode avaliar o próprio pico? | Não, para manter a nota confiável. |
| D6 | `Spot.modality` é texto livre. Lista fechada? | Lista fechada (ex.: street, park, bowl/pool, vertical, downhill, mista). O dono/UX confirma a lista. |
| D7 | Perfil: editar e-mail e avatar? | MVP edita só o nome; e-mail imutável (é o login); avatar é Could (GP-080). O `nickname` do input de signup será removido (não existe no modelo). |
| D8 | Duração da sessão (JWT)? | 7 dias sem refresh token; ao expirar, volta ao login. |
| D9 | Limites de fotos por pico e tamanho? | Mínimo 1 e máximo 5 fotos por pico, até 5 MB cada. |
| D10 | Visitante sem conta pode ver o mapa? | Não no MVP: todo o conteúdo exige login (como hoje, `@Authenticated`). Leitura pública fica para depois. |
| D11 | Plataformas mobile do MVP: iOS e Android? | Ambos compilam e funcionam; validação E2E (Maestro) e critério de aceite principal no iOS; APK Android para teste do dono via `development`. |
| D12 | Idioma do app | pt-BR no MVP, textos centralizados para i18n futuro (GP-097). |
| D13 | Qualquer usuário pode editar fotos/dados de qualquer pico (wiki) ou só o autor? | Só o autor (regra atual do time). Colaboração aberta e moderação ficam pós-MVP. |

## Resumo de priorização
Total: 69 histórias - Must 49, Should 14, Could 2, Won't 4 (atualizar ao alterar o backlog).
