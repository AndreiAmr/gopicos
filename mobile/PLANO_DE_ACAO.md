# Plano de Acao Mobile - GoPicos

## Estado Atual (23/06/2026)

- Navegacao inicial implementada com 1 tela: Login.
- UI base pronta: tema, componentes atomicos Text e Input, provider Apollo.
- Mutacao GraphQL de login implementada no mobile.
- Bloqueio principal identificado: resposta de login no backend nao estava retornando payload.
- Bloqueio de ambiente identificado: uso de localhost no mobile (Android emulator nao resolve localhost da maquina host).

## O Que Foi Ajustado Agora

- Backend: retorno do login corrigido em backend/src/controllers/authentication/login.ts.
- Mobile: endpoint Apollo ajustado para usar 10.0.2.2 no Android emulator e localhost no iOS simulator em mobile/src/config/apollo.ts.

## Marco Atual do Produto (checkpoint)

MVP funcional parcial:

- Login: quase pronto (falta tratamento de erro, sucesso e persistencia de sessao).
- Pos-login: ainda nao iniciado (sem Home, sem guard de autenticacao, sem logout).

## Backlog Prioritario (ordem de execucao)

### Fase 1 - Fechar autenticacao (2 a 3 dias)

1. Mostrar feedback de erro no login (credencial invalida, erro de rede).
2. Salvar token apos sucesso (secure storage).
3. Criar estado global de sessao (AuthProvider simples).
4. Redirecionar para Home apos login bem-sucedido.
5. Implementar logout.

Criterio de pronto da Fase 1:

- Usuario consegue entrar, permanecer logado, abrir app novamente e continuar autenticado.

### Fase 2 - Fluxo principal minimo (3 a 5 dias)

1. Criar tela Home inicial.
2. Listar spots principais (read-only).
3. Detalhe de spot (informacoes basicas).
4. Estado de loading e vazio nas telas.

Criterio de pronto da Fase 2:

- Usuario autenticado navega Home -> Detalhe sem erro.

### Fase 3 - Qualidade e estabilidade (2 dias)

1. Padronizar chamadas GraphQL (hooks por feature).
2. Adicionar testes de fluxo critico (login + navegacao basica).
3. Definir checklist de release local (android e ios).

Criterio de pronto da Fase 3:

- Fluxo principal estavel e repetivel em ambiente local.

## Rotina de Execucao Constante

Cadencia semanal:

- Segunda a sexta: 45 a 90 minutos por dia.
- Sabado: 30 minutos para revisao de backlog da semana.

Ritual diario (simples):

1. Escolher 1 tarefa pequena (maximo 90 minutos).
2. Implementar sem trocar de contexto.
3. Rodar validacao minima local.
4. Registrar o que foi feito e o proximo passo em 3 linhas.

Template de registro diario:

- Hoje finalizei:
- Bloqueios encontrados:
- Proxima tarefa objetiva:

## Regras Antitravamento

- Nunca iniciar mais de 1 feature por vez.
- Sempre quebrar tarefa grande em subtarefa de ate 90 minutos.
- Se travar por mais de 20 minutos, registrar bloqueio e mudar para subtarefa menor.
- Todo dia deve terminar com uma proxima tarefa ja definida.

## Proximo Passo Imediato (agora)

Implementar na tela de login:

1. Exibir mensagem de erro amigavel.
2. Tratar estado de sucesso.
3. Navegar para uma Home temporaria apos login.
