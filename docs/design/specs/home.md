# Spec de UX - Home (mapa) com identidade de rua

Issues: #183 (GP-106, parte Home; criar/editar pico ficam para a próxima rodada da mesma issue) e #51 (GP-048, seletor de camadas). Relacionadas: #179 (GP-102, DS v3), GP-103 (BottomSheet e zonas reservadas), GP-114 (resumo do pico como sheet), GP-120/GP-121 (identidade do mapa).
Pedido do dono (2026-10-23): a Home tem que deixar claro que é um app para skatistas (tags, grafite, pichação), com tab bar Mapa / Novo pico / Perfil, botões de camadas e de localização no canto direito, filtros com cara de rua e, no topo, quantos picos e quantos filtros.
Base: `docs/design/design-system.md` v2.0 (seção 13, camada de marca), `specs/picos.md` e `specs/picos-fechamento.md`. **Onde esta spec divergir delas para a Home, vale esta.** Decisões novas: **UX-H1 a UX-H19** (seção 13).
Decisões do dono no E8 (PR #209, mergeado), **aprovadas conforme a recomendação do PO**: D39 (exceções ao sheet: telas nativas do sistema, toasts, sugestões da busca inline), D40 (sem sheet sobre sheet), **D41** (fonte de tag só em títulos fixos; no mapa só pins, polígonos e controles estilizados), **D42** (gíria curta, nunca em erro) e **D43** (Permanent Marker nos títulos; lettering de pichação só como arte vetorial). Esta spec já as aplica.
**Referência visual: protótipo HTML `docs/design/prototipos/home.html`** (autorizado pelo dono enquanto o Figma está sem cota). Abrir no navegador; seletor de tema, de estado, de zonas reservadas e das alternativas no topo (seção 16). Os frames do Figma ficam para quando houver cota.

---

## 1. Objetivo

Abrir o app e entender em 2 segundos: **isto é um mapa de picos de skate**, quantos picos há na área que estou vendo e se algum filtro está escondendo picos. Daqui a pessoa: (a) explora e abre um pico, (b) cadastra um pico novo, (c) muda o tipo de mapa ou volta para a própria posição, (d) filtra.

## 2. Hierarquia (mobile)

1. **Mapa** em tela cheia (fica atrás de tudo, inclusive atrás da status bar).
2. **Zona do topo** (header flutuante, sem fundo próprio):
   1. Campo de busca de lugar (já existe, GP-046).
   2. Linha de status: botão **Filtros** (sticker) + **fita de placar** "32 picos na área · 2 filtros".
   3. Linha de chips dos filtros ativos (só aparece com filtro ativo; já existe).
3. **Coluna de controles** no canto inferior direito: **Camadas** (em cima) e **Minha localização** (embaixo, mais perto do polegar).
4. **Pins, clusters e polígonos** (identidade no estilo dos pins, seção 6.6).
5. **Resumo do pico** em sheet peek (GP-114), sobe acima da tab bar.
6. **Tab bar** fixa embaixo: **Mapa**, **Novo pico**, **Perfil**.

O FAB "+" da Home **sai** (o "Novo pico" vai para a tab bar, ver UX-H1).

## 3. Navegação: o que muda em `mobile/src/routes/`

Hoje (`routes/HomeStack/index.tsx`): um `createBottomTabNavigator` com 3 telas, `Home` (HomeTemplate), **`NewSpot` que também renderiza `HomeTemplate`** (placeholder: tocar nela mostra um segundo mapa) e `Profile` (ProfileStack). A `TabBar` (`routes/HomeStack/TabBar`) é flutuante (90% da largura, `position: absolute`, `bottom = insets.bottom`, `zIndex 999`), com ícones de 15 px e cores Tamagui genéricas (`orange10`, `colorHover`), fora dos tokens. Criar pico abre `NewSpotLocation` pelo FAB da Home.

O que muda (especificação, sem código de produção):

| Item | Hoje | Proposta |
|---|---|---|
| Aba **Mapa** (`Home`) | HomeTemplate | Igual. Tocar na aba já ativa: fecha o sheet aberto ou, sem sheet, recentraliza na última área (não reseta filtros). |
| Aba **Novo pico** (`NewSpot`) | Renderiza outra HomeTemplate | Vira **aba de ação**: não tem tela própria. No `tabPress`, `preventDefault()` e `navigate('NewSpotLocation')` no RootStack (fluxo de criar que já existe). A aba nunca fica "selecionada"; ao voltar do fluxo, a aba ativa continua sendo a anterior. Na rota, a tela pode ser um componente vazio só para o navegador aceitar a aba. |
| Aba **Perfil** | ProfileStack | Igual. Continua escondendo a tab bar nas telas de formulário (`PROFILE_FORM_SCREENS`). |
| FAB "+" na Home | `home-fab` | **Removido.** O rótulo de acessibilidade "Cadastrar novo pico" passa para a aba Novo pico. |
| TabBar | Flutuante, 90%, absoluta | **Ancorada** na base, largura total, altura 64 + `insets.bottom`, fundo `surface`, sem sombra flutuante (seção 6.1). A tela do mapa recebe `bottomInset` = altura real da tab bar para posicionar sheets, controles e ornamentos do Mapbox. |
| Teclado | (nada) | `tabBarHideOnKeyboard: true` (no Android com `adjustResize` a tab bar subiria junto do teclado e cobriria a lista da busca). |
| Sessão expirada no "Novo pico" | (n/a) | Igual ao resto do app: volta ao Login com aviso. |

Isso **substitui a D25** (TabBar com Mapa e Perfil + FAB), por pedido do dono nesta rodada.

## 4. Zonas reservadas

Regra geral (GP-103, CT-SOBREP): cada zona tem dono único; nada desenha dentro da zona de outro, em repouso, com teclado, com sheet aberto ou expandido e com toast visível. z-index do DS: mapa 0, controles 10, header 20, sheet 40, toast 60, mais a **tab bar 30** (proposta nova, abaixo do sheet modal e acima dos controles).

| Zona | Dono | Regra |
|---|---|---|
| Z0 Status bar / notch / Dynamic Island | sistema | Nada interativo acima de `insets.top`. O mapa pode aparecer ali (ícones do sistema seguem o tema). |
| Z1 Topo (header) | busca + linha de status + chips | Começa em `insets.top + 8`. Gutter 16. Altura: 48 + 8 + 48 (+ 8 + 44 com filtros ativos). |
| Z2 Coluna de controles | Camadas e Localização | Direita, 16 da borda, 2 botões 48 com 8 entre eles (104 de altura). Ancorada **16 acima do que estiver mais alto embaixo**: topo da tab bar, ou topo do sheet peek. |
| Z3 Ornamentos do Mapbox | logo + botão "i" de atribuição | Canto inferior esquerdo, 8 da borda, 8 acima da tab bar ou do sheet. **Obrigatórios pelos termos do Mapbox** (hoje desligados no código: `logoEnabled={false}`, `attributionEnabled={false}`). Com sheet modal aberto (filtros, camadas, permissão) ficam ocultos sob o véu, porque o mapa não está em uso. |
| Z4 Toast | toasts | **Embaixo**, à esquerda da coluna: da borda esquerda (16) até 8 antes da coluna (largura = tela - 16 - 16 - 48 - 8), base 8 acima do logo do Mapbox, até 3 linhas (96). Hoje o toast fica no topo (`insets.top + 8`) e **cobre a busca**: muda. Exceção: com sheet modal expandido (sem espaço acima dele), o toast aparece no topo da safe area, por cima do sheet, na largura toda. |
| Z5 Sheet (resumo, vazio, filtros, camadas, permissão) | BottomSheet do DS | Sempre **acima da tab bar** (`bottomInset` = altura da tab bar). Topo máximo do sheet expandido: `insets.top + 8` (nunca sob a status bar). |
| Z6 Tab bar | navegação | Base da tela, 64 + `insets.bottom`. Nada a cobre: o fundo escurecido dos sheets modais (filtros, camadas) cobre mapa e topo, **não** a tab bar. Tocar numa aba com sheet aberto fecha o sheet primeiro e então navega. |
| Z7 Teclado | sistema | Com a busca focada: Z2, Z3, Z4 e Z6 somem (tab bar escondida pelo teclado), a lista de sugestões vai da busca até o topo do teclado. |

### 4.1 Posições calculadas (px, retrato)

**iPhone SE 375 x 667** (`top` 20, `bottom` 0):
| Elemento | Repouso | Com resumo (peek 188) |
|---|---|---|
| Busca | 28 a 76 | igual |
| Linha de status | 84 a 132 | igual |
| Chips ativos | 140 a 184 | igual |
| Tab bar | 603 a 667 | igual |
| Coluna (Camadas / Localização) | 483 a 531 / 539 a 587 | 295 a 343 / 351 a 399 |
| Logo Mapbox | 571 a 595 (esq.) | 383 a 407 |
| Toast (até 3 linhas, 96) | 467 a 563, x 16 a 303 | 279 a 375 |
| Sheet peek | (fechado) | 415 a 603 |
| Mapa livre (entre topo e tab bar/sheet) | 184 a 603 | 184 a 415 (231 de altura, a coluna cabe com 48 de folga em cima) |

**Android 360 x 640** (status 24; barra de navegação de 3 botões 48, edge-to-edge do Android 15):
| Elemento | Repouso | Com resumo |
|---|---|---|
| Busca / status / chips | 32 a 80 / 88 a 136 / 144 a 188 | igual |
| Tab bar (64 + 48) | 528 a 640 (conteúdo 528 a 592) | igual |
| Coluna | 408 a 456 / 464 a 512 | 220 a 268 / 276 a 324 |
| Sheet peek | (fechado) | 340 a 528 |
| Mapa livre | 188 a 528 | 188 a 340 (152: cabe a coluna, 32 de folga) |
Com navegação por gestos (inset ~24) tudo desce 24.

**iPhone com notch/Dynamic Island 393 x 852** (`top` 59, `bottom` 34): busca 67 a 115, status 123 a 171, chips 179 a 223; tab bar 754 a 852 (conteúdo 754 a 818); coluna 634 a 682 / 690 a 738; com peek: sheet 566 a 754, coluna 446 a 494 / 502 a 550.

### 4.2 Regra de convivência coluna x sheet x pins
- A coluna acompanha o topo do sheet em tempo real (`animatedPosition` do gorhom), sem salto.
- Quando o espaço livre entre o fim de Z1 + 16 e o topo do sheet - 16 fica menor que 104 (sheet expandido, ou SE com chips e resumo expandido), a coluna **some** (opacidade 0 em 120 ms, sai da ordem de foco). Ela volta quando o sheet desce. Nunca fica parcialmente coberta.
- Ao selecionar um pico, a câmera centraliza o pico **no centro da área livre** (padding da câmera: topo = fim de Z1, base = topo do sheet, direita = 16 + 48 + 8), para o pin não ficar atrás do sheet nem da coluna.
- Clusters e pins não têm zona: ficam no mapa e podem passar por baixo dos controles ao arrastar (é o mapa). O que se garante é o padding acima ao centralizar e que um toque no controle nunca seleciona o pin de baixo.

## 5. Tab bar (mobile)

- Ancorada, largura total, altura 64 + `insets.bottom`, fundo `surface`, borda superior 2 px `sticker-outline` (seção 11). Três alvos iguais (largura/3, altura 64).
- **Mapa** e **Perfil**: ícone 24 (`MapPin`, `User`) + rótulo `caption` 12/600 (o DS libera 12 em legenda; aqui o rótulo acompanha o ícone, nunca está sozinho). Ativa: ícone preenchido, rótulo em `text` 700 e **traço de spray** `primary` de 24 x 6 sob o rótulo (asset `brand/spray-stroke.svg`). Inativa: ícone contorno, rótulo `text-muted`. Estado não depende só de cor: forma do ícone + traço + peso.
- **Novo pico** (centro): **sticker** 40 x 34 dentro da barra (não ultrapassa a borda superior, para não invadir a Z2), fundo `primary`, borda 2 `ink`, sombra rígida `sticker-shadow`, giro -3 graus, ícone `+` 24 em `on-primary`; rótulo "Novo pico" abaixo. Pressed: escala 0,96 e sombra 1 px (o adesivo "afunda"). Alvo da aba inteira (largura/3 x 64).
- Acessibilidade: `accessibilityRole="tab"` em Mapa e Perfil com `selected`; Novo pico é `button` com rótulo "Cadastrar novo pico". Ordem: Mapa, Novo pico, Perfil.
- Tema escuro: `surface` escuro, borda superior `sticker-outline` escuro, sombra do sticker em `brand-yellow` (DS 13.3).

## 6. Componentes e estados

### 6.1 Linha de status: botão Filtros + fita de placar
- **Botão Filtros** (`FilterButton`): sticker de 48 de altura, raio `sm`, fundo `surface`, borda 2 `sticker-outline`, sombra rígida, ícone `SlidersHorizontal` 20 + "Filtros" Inter 16/600. Com filtros: fundo `brand-yellow`, texto `ink` e **selo** circular 20 `ink` com o número em `brand-yellow` (11,57:1). Rótulo de acessibilidade: "Filtros, 2 aplicados".
- **Fita de placar** (`ScoreTape`, componente novo): faixa de fita adesiva `brand-yellow` com pontas recortadas (SVG), altura 36, giro -1,5 graus, texto Inter 14/600 `ink`. Não é botão; `accessibilityRole="text"`, `accessibilityLiveRegion="polite"` (anuncia mudanças com atraso de 1 s após o mapa parar). Ocupa o resto da linha; a 130% de fonte quebra em 2 linhas (altura 52) e a linha de status cresce, empurrando os chips (o topo de Z1 cresce, a regra da coluna recalcula).
- **O que é "na área":** picos (após os filtros) cujo polígono toca a área visível do mapa, recontados quando a câmera para (`onMapIdle`, 300 ms). Hoje `getAllSpots` carrega todos os picos de uma vez, então a contagem é feita no cliente; não precisa de backend. Ver pendência P6.

| Estado | Fita | Botão Filtros | Resto da tela |
|---|---|---|---|
| Carregando (1a carga) | "Carregando picos..." com ícone de roda girando 16 (com "reduzir movimento": ícone parado) | normal | mapa usável |
| Recarregando (aplicar filtro) | "Atualizando..." | `loading` (spinner no lugar do ícone, largura mantida) | último resultado continua no mapa |
| Carregado, sem filtro | "32 picos na área" (1: "1 pico na área"; mais de 999: "999+ picos na área") | sem selo | |
| Carregado, com filtro | "32 picos na área · 2 filtros" (1: "1 filtro") | amarelo + selo "2" | linha de chips aparece |
| Zero picos | "Nenhum pico na área" | normal | sheet do vazio (6.7) |
| Zero por filtro | "0 picos com 2 filtros" | amarelo + selo | sheet do vazio por filtro (6.7) |
| Erro | a fita vira `AlertBanner` error do DS na mesma linha (ícone + "Não foi possível carregar os picos." + "Tentar novamente"), Inter, **sem gíria e sem fita** (D42) | escondido enquanto o erro aparece; volta com o retry | último resultado continua, se houver |
| Offline | igual ao erro, texto "Sem conexão. Os picos não foram atualizados." | | |
| Mapa não configurado (`isMapboxConfigured` falso) | `AlertBanner` existente | escondido | |

### 6.2 Chips de filtros ativos (linha 3)
Mesma lógica de hoje (`FilterBar`): um chip por filtro, rolagem horizontal, tocar remove e reaplica na hora. Visual novo: sticker `brand-yellow`, borda 2 `ink`, sombra rígida 2 px, giro alternado -1 / +1 grau, Inter 14/600 `ink`, ícone X 16; altura visual 36, alvo 44. Rótulo "Remover filtro Street".

### 6.3 Coluna de controles (Z2)
Dois `MapControlButton` (componente novo): 48 x 48, raio `md`, fundo `surface`, borda 2 `sticker-outline`, sombra rígida `3px 3px 0` (`ink` no claro, `brand-yellow` no escuro), ícone 24 `text`. Pressed: deslocamento 2 px para baixo/direita e sombra 1 px. Foco: anel `focus` 2 px por fora. Espaço entre eles 8.

**Camadas** (`Layers`): abre o sheet de camadas (6.5). Rótulo "Camadas do mapa, atual: Rua". Com camada diferente de Rua, ganha um selo 12 `primary` com borda `ink` no canto (e o rótulo diz a camada; não é só cor).

**Minha localização**, estados:
| Estado | Ícone | Ação ao tocar | Acessibilidade |
|---|---|---|---|
| Ainda não pedida | `LocateFixed` contorno | pede a permissão do sistema (exceção D39) e passa a "Buscando" | "Centralizar na minha localização" |
| Buscando | anel girando em volta do ícone (com "reduzir movimento": ícone `Locate` com reticências, sem giro) | nada (desabilitado por até 10 s) | "Buscando sua localização", `busy` |
| Localizado e centralizado | `Navigation` preenchido, fundo `primary-soft`, borda `sticker-outline` | alterna para seguir a direção (pós-MVP); no MVP, nada | "Centralizado em você" |
| Localizado, mapa movido | `LocateFixed` contorno | centraliza (voo curto; salto com "reduzir movimento") | "Centralizar na minha localização" |
| Permissão negada | `LocateOff` (mira cortada) + selo `!` `warning` 12 | abre **sheet de permissão** (6.8) | "Localização desativada. Toque para saber como ativar" |
| Erro (GPS desligado, tempo esgotado) | volta ao anterior | toast error "Não foi possível achar sua localização. Tente de novo." | toast anunciado |

### 6.4 Busca de lugar (existente, GP-046)
Mesmo comportamento da `picos-fechamento.md` 7. Visual: campo do DS (48, `surface`, borda `border` 1,5, raio `md`), ícone de lupa, placeholder "Buscar cidade ou endereço". Sem fonte de tag (é campo). Ao focar: mapa escurece (`rgba(0,0,0,.4)`), lista de sugestões entre o campo e o teclado, coluna, ornamentos, toast e tab bar somem; "Cancelar" à direita.

### 6.5 Sheet de camadas (GP-048, #51)
- BottomSheet do DS, variante **seletor de escolha única**, sem fundo escurecido forte (`rgba(0,0,0,.2)`), para ver o mapa mudar atrás. Altura do conteúdo (~300; SE: 307 a 603). Um snap só (não expande além do conteúdo).
- Cabeçalho: alça, título **"Camadas"** em Permanent Marker 28 + spray curto, botão fechar X 48 à direita.
- Três cartões lado a lado (largura (tela - 32 - 16)/3, ~109 no SE), cada um: miniatura 72 de altura (ilustração vetorial do estilo, não print do mapa, para não depender de rede), nome Inter 16/600 e descrição `caption` `text-muted` em 1 a 2 linhas:
  - **Rua** - "Ruas e nomes" (padrão)
  - **Satélite** - "Foto aérea com ruas"
  - **Concreto** - "Mapa cinza, picos em destaque"
- Selecionado: borda 2 `ink`/`sticker-outline`, sombra rígida, giro -2 graus e **selo de check** 24 (`primary` + check `on-primary`) no canto. Não selecionado: borda 1,5 `border`, sem sombra. `accessibilityRole="radio"`, grupo "Tipo de mapa".
- Comportamento: tocar troca o estilo **na hora**; o sheet fica aberto (dá para comparar) e fecha por gesto, X, toque fora ou toque na aba Mapa. A escolha **persiste no aparelho** (pendência P4) e é a mesma na web.
- Estados: trocando (spinner 16 sobre a miniatura escolhida até o estilo carregar; o anterior continua até lá); **erro** (sem rede para o satélite): volta para a camada anterior e toast error "Não foi possível carregar o mapa de satélite." (sem gíria).
- Pins, polígonos e clusters ficam por cima em qualquer camada, com o mesmo visual (o contorno `ink` do pin garante leitura no satélite).

### 6.6 Pins, clusters e polígonos (estilo de rua, D41: só no que é do mapa)
- **Pin** (`SpotPin`, atualiza a picos-fechamento 11): pílula sticker 26 de altura, fundo `surface`, **borda 1,5 `ink`** (escuro: `sticker-outline`), sombra rígida `2px 2px 0`, "★ 4,6" (estrela `star`) ou "Novo". Selecionado: 30 de altura, fundo `primary`, texto `on-primary`, borda 2, sombra 3 px e giro -3 graus (forma muda, não só cor).
- **Cluster:** círculo com contagem (tamanhos da picos-fechamento 11), borda 2 `ink`, **contorno externo tracejado** de 2 px a 3 px de distância (lembra marca de spray); sem nota. Se o filtro deixa só 1 pico num grupo, ele aparece como pin comum (não existe cluster de 1).
- **Polígono:** preenchimento `primary` 22%, contorno 2 px `primary`; selecionado: contorno 3 px `primary-text` **tracejado 6/3** + preenchimento 38%. Nenhuma textura ou fonte de tag sobre o mapa.

### 6.7 Sheets da Home (peek e vazio)
- **Resumo do pico** (GP-114): sheet peek 188 (SpotPreview atual: foto 72, nome Inter, chip de modalidade sticker, nota, distância e "Ver detalhes"); expandido até 60% com descrição curta e fotos. Fundo sem escurecer (o mapa continua usável). Tocar em outro pico troca o conteúdo sem fechar.
- **Vazio** (sheet peek, sem fundo escurecido): título fixo em Permanent Marker 24 **"Nenhum pico por aqui"**, texto Inter "Conhece um pico nessa área? Marca ele aí pra galera.", botão primário "Cadastrar o primeiro pico" (abre o fluxo de criar). Ilustração vetorial pequena (64, cone/shape) à direita do título, decorativa (GP-104).
- **Vazio por filtro:** título "Nada com esses filtros", texto "Tente mudar ou limpar os filtros.", botão "Limpar filtros".
- O resumo e o vazio nunca aparecem juntos (já é assim no código). Filtros e camadas são modais: o peek não fecha, fica embaixo do modal (sem empilhar dois sheets visíveis, D40) e reaparece quando o modal fecha.

### 6.8 Sheet de permissão de localização
Título fixo "Ative a localização" (Inter `h2`, não é título de tela, é aviso: sem fonte de tag), texto "Assim o mapa abre nos picos perto de você. Dá para ativar nos ajustes do aparelho.", botões "Abrir ajustes" (primário, `Linking.openSettings()`) e "Agora não" (ghost). Substitui o toast da picos.md 4.4 (D38: o que tem ação vira sheet).

### 6.9 Sheet de filtros (identidade de rua)
Mesmo conteúdo e lógica de hoje (`FilterSheet` do mobile, painel do web, GP-047 / PR #166, `domain/spot/filters.ts`): **Modalidade** (multisseleção: Street, Park, Bowl/Pool, Vertical, Downhill, Mista), **Entrada** (Todos | Gratuito | Pago), **Somente cobertos** (Switch), **Nota mínima** (Qualquer | 3+ | 4+ | 5), "Limpar filtros" e "Aplicar filtros". E lógico entre seções, OU dentro de modalidade.

Visual novo:
- Cabeçalho: alça; título **"Filtros"** em Permanent Marker 30 com spray `primary` abaixo; à direita, "Limpar" (`TextLink` 48 de alvo, só com rascunho ativo). Canto superior direito do sheet com um **meio-tom** a 30% (fora do texto e dos botões, DS 13.4).
- **Títulos de seção como fita** (`TapeLabel`, componente novo): pedaço de fita `brand-yellow` (SVG) com o nome em **Inter 14/700 `ink`**, giro -2 graus. Ver UX-H8 e P2 (alternativa: Permanent Marker 24 nas seções).
- **Modalidade** como **adesivos** (`FilterChip` v3): desmarcado `surface` + borda 1,5 `border` + texto `text`; marcado `brand-yellow` + borda 2 `ink` + sombra rígida + **ícone de check** 16 antes do texto + giro de -2 graus ("colou o adesivo"). Altura 44, quebra de linha em grade.
- **Entrada e Nota mínima** como `Segmented` sticker: trilho `sunken` com borda 2 `sticker-outline`, opção escolhida em `primary` + texto `on-primary` 600 + borda `ink`; opções em Inter. A nota mínima mostra estrela antes do número ("★ 3+").
- **Somente cobertos**: `SwitchRow` do DS (ligado `primary`, polegar com borda `ink`).
- Rodapé fixo (acima da tab bar e do home indicator): botão primário "Aplicar filtros" (com contagem conhecida: "Ver 12 picos"), largura total, 48.
- Alturas: snap 1 = conteúdo até 70% da área disponível; snap 2 (expandido) = do topo `insets.top + 8` até a tab bar. No SE o conteúdo (~590) não cabe no snap 1: rolagem interna com rodapé fixo. Fundo escurecido `rgba(0,0,0,.4)` sobre mapa e topo, não sobre a tab bar.
- **Prévia ao vivo:** enquanto o sheet está aberto, cada toque num adesivo ou opção atualiza na hora a **fita do topo**, a linha de chips e os pins atrás do véu, e o botão vira "Ver N picos". É prévia: só "Aplicar" confirma; fechar sem aplicar volta ao filtro anterior. A contagem é feita no cliente (todos os picos já estão carregados), então a prévia não faz requisição; ao aplicar, a query com os filtros do backend roda como hoje.
- Estados: rascunho/prévia; aplicando (botão `loading`); erro ao aplicar (toast existente, Z4); fechar sem aplicar descarta o rascunho (já é assim).

## 7. Teclado e safe area

- Só a busca abre teclado na Home. Com o teclado: Z1 fica, a lista ocupa até o topo do teclado (`keyboardShouldPersistTaps="handled"`), tab bar escondida (`tabBarHideOnKeyboard`), coluna/ornamentos/toast escondidos, sheet peek fecha (volta ao cancelar a busca se o pico seguir selecionado).
- Nenhum sheet da Home tem campo de texto; se um dia tiver, segue o comportamento de teclado do BottomSheet do GP-103 (`keyboardBehavior="interactive"`, rodapé acima do teclado).
- Safe area: Z1 começa em `insets.top + 8`; tab bar soma `insets.bottom`; sheets usam `topInset = insets.top + 8` e `bottomInset = altura da tab bar`. Paisagem: fora do MVP (o app é retrato).

## 8. Acessibilidade

- Alvos de 48 em tudo que é controle (busca, Filtros, coluna, abas, cartões de camada, sticker de modalidade com 44 de visual e área de 48). Espaço mínimo 8.
- Contraste (DS v2 + tokens novos da seção 11): `ink` sobre `brand-yellow` 11,57:1 (fita, chips, selo); `on-primary` sobre `primary` 6,32 / 8,49; borda `sticker-outline` sobre `surface` 17,72 (claro) e 15,97 (escuro); `text-muted` em descrições 7,25 / 8,63. Nada de texto sobre textura.
- Nunca só cor: filtro ativo = selo com número + texto na fita + chips; camada selecionada = check + borda + giro; aba ativa = ícone preenchido + spray + peso; pin selecionado = tamanho + giro + borda; localização = ícone diferente por estado.
- Leitor de tela: ordem de foco = busca, Filtros, fita (texto), chips, Camadas, Localização, abas. O mapa segue sem leitura (UX-P17); a fita dá a contagem por texto. Mudanças da fita anunciadas com `polite`.
- Elementos decorativos (fita, spray, meio-tom, giro) ocultos do leitor de tela.
- Reduzir movimento: sem giro do loader, sem voo de câmera, sheets com fade; o giro estático dos stickers continua (não é movimento).
- Fonte a 130%: fita e Filtros quebram em 2 linhas; rótulos das abas quebram em 2 linhas (altura da barra 64 aguenta 12 x 1,3 x 2 + 24 de ícone); cartões de camada aceitam descrição em 3 linhas.

## 9. Microcopy (PT-BR)

| Onde | Texto |
|---|---|
| Abas | "Mapa", "Novo pico", "Perfil" (Novo pico, rótulo de acessibilidade: "Cadastrar novo pico") |
| Busca | "Buscar cidade ou endereço" |
| Fita | "Carregando picos...", "Atualizando...", "32 picos na área", "1 pico na área", "32 picos na área · 2 filtros", "Nenhum pico na área", "0 picos com 2 filtros" |
| Filtros | "Filtros", "Limpar", "Modalidade", "Entrada", "Somente cobertos", "Nota mínima", "Aplicar filtros", "Ver 12 picos" |
| Camadas | "Camadas", "Rua" / "Ruas e nomes", "Satélite" / "Foto aérea com ruas", "Concreto" / "Mapa cinza, picos em destaque" |
| Localização | "Centralizar na minha localização", "Buscando sua localização", "Centralizado em você" |
| Permissão | "Ative a localização" / "Assim o mapa abre nos picos perto de você. Dá para ativar nos ajustes do aparelho." / "Abrir ajustes" / "Agora não" |
| Vazio | "Nenhum pico por aqui" / "Conhece um pico nessa área? Marca ele aí pra galera." / "Cadastrar o primeiro pico" |
| Vazio por filtro | "Nada com esses filtros" / "Tente mudar ou limpar os filtros." / "Limpar filtros" |
| Erros (sem gíria, D42) | "Não foi possível carregar os picos." + "Tentar novamente"; "Sem conexão. Os picos não foram atualizados."; "Não foi possível carregar o mapa de satélite."; "Não foi possível achar sua localização. Tente de novo."; "Não foi possível aplicar os filtros." |

Gíria (D42) só em vazio e convite ("pra galera", "Marca ele aí"); títulos e erros diretos.

## 10. Web (adaptação, aprovada pelo dono em 2026-10-23)

A tab bar é só do mobile. No web, o equivalente mínimo, sem novas funcionalidades:
- **Navegação:** a sidebar que já existe (`AppSidebar`, shadcn) fica com exatamente **3 itens na mesma ordem e com os mesmos ícones**: Mapa, Novo pico (abre `/spot/new-spot`), Perfil. Hoje ela tem "Pesquisar pico", "Lista de picos", "Cadastrar novo pico", "Ver meu perfil"; os dois primeiros saem (a busca já está no mapa). Em >= 1024 a sidebar fica como trilho de 72 com ícone + rótulo `caption`; abaixo de 1024 vira gaveta (já existe). Item ativo: fundo `primary-soft`, traço de spray e peso 700. "Novo pico" com o mesmo sticker laranja da tab bar.
- **Topo do mapa:** busca (420) e, abaixo, a mesma linha Filtros + fita de placar + chips, a 24 do header.
- **Controles:** coluna no canto **inferior direito**, 24 da borda: Camadas, Localização e, só no web, zoom + e - (o mobile usa gesto). Mesmo `MapControlButton`.
- **Véu dos Dialogs:** cobre só a área do mapa, não o header nem a sidebar (mesma regra da tab bar no mobile); clicar na sidebar fecha o Dialog e navega.
- **Camadas e filtros:** Dialog do Radix com a identidade (título em Permanent Marker, fita nas seções, adesivos), conforme a regra do dono. Filtros: o painel atual (`role="dialog"`) passa ao Dialog do DS (GP-117). Camadas: Dialog de 440 com os 3 cartões. Alternativa a avaliar: popover não modal ancorado ao botão (o mapa muda atrás sem véu); ver P7.
- **Toasts** (sonner, hoje no topo direito): passam para o canto inferior esquerdo do mapa, para não cobrir header nem a coluna.
- Abaixo de 640: layout mobile sem tab bar (a sidebar vira gaveta pelo header), como já está na picos-fechamento.

## 11. Tokens novos (proposta para o DS v3, GP-102)

| Token | Claro | Escuro | Uso | Contraste |
|---|---|---|---|---|
| `sticker-outline` | `#18181B` (= `ink`) | `#F5F6F7` | borda de controles sticker, tab bar, cartões selecionados | sobre `surface`: 17,72 / 15,97 (UI >= 3) |
| `sticker-shadow-sm` | `2px 2px 0 ink` | `2px 2px 0 brand-yellow` | pins, chips ativos | decorativo |
| `tape` (asset) | `brand/tape.svg` com `brand-yellow` | igual | fita de placar e títulos de seção | `ink` sobre amarelo 11,57 |
| `map-dim` | `rgba(0,0,0,.4)` | `rgba(0,0,0,.55)` | véu do mapa com busca/filtros | n/a |
| `z.tabBar` | 30 | 30 | tab bar entre controles (10) e sheet (40) | n/a |
| `map-style.*` | `street`, `satellite`, `concrete` | idem | ids dos estilos de mapa (seção 12) | n/a |

Sem cores novas de "tag" (rosa, ciano): o pedido cabe no laranja + amarelo + `ink` já aprovados; mais cores competiriam com o mapa (princípio 4). Mapeamento: Tailwind `--gp-sticker-outline`, `shadow-sticker-sm`, `z-tabbar`; Tamagui `$stickerOutline`, `zIndex.tabBar`.

## 12. Camadas: quais e por quê (GP-048)

O web usa um estilo próprio do Mapbox baseado no **Standard** (`mapbox://styles/soneca-dev/...`, por isso exige mapbox-gl >= 3.30). O mobile (`@rnmapbox/maps` 10.3) hoje não passa `styleURL`; o Dev deve passar o Standard explicitamente para os dois ficarem iguais. A branch antiga da #51 usava streets/outdoors/satellite clássicos.

| Camada | Estilo Mapbox | Por quê |
|---|---|---|
| **Rua** (padrão) | Standard; `lightPreset` `day` no tema claro e `night` no escuro | É o que já usamos; nomes de rua e pontos de referência para chegar ao pico; o modo noite já cobre "mapa escuro", sem uma quarta opção. |
| **Satélite** | Standard Satellite (`mapbox://styles/mapbox/standard-satellite`), com ruas e rótulos | Pedido do dono. Skatista enxerga o pico de verdade: piso, escada, corrimão, bowl. Ajuda a conferir o polígono antes de ir. |
| **Concreto** | Standard com `theme` `monochrome` (`lightPreset` conforme o tema) | O mapa fica cinza e o laranja dos picos salta: melhor leitura sob sol e com muitos picos. Conversa com a identidade (concreto). |

Por que não "Escuro/Noite" como terceira: o Standard já troca para noite no tema escuro do app (D1), então "Noite" duplicaria a Rua para quem usa o tema escuro. Por que não Outdoors: relevo e trilha servem pouco para skate urbano. Os três são o mesmo estilo base (Standard), então a troca é barata (config de tema, não outro estilo inteiro, exceto o satélite) e o visual de pins/polígonos é um só. **Alternativa para o dono:** trocar Concreto por **Noite** (forçar `night` mesmo no tema claro). Ver P3.

## 13. Decisões e justificativas

**UX-H1. Novo pico na tab bar, sem FAB.** Pedido do dono. Ganho: uma ação principal fixa e sempre no mesmo lugar, alcançável pelo polegar, e o canto inferior direito fica livre para camadas e localização (antes FAB, localização e camadas disputavam o mesmo canto). Substitui D25.
**UX-H2. "Novo pico" é aba de ação.** Ela abre o fluxo de criar (tela empilhada) em vez de ter uma tela própria; assim o "voltar" leva para onde a pessoa estava e o fluxo de criar não precisa ser duplicado. Corrige o placeholder atual que mostra um segundo mapa.
**UX-H3. Tab bar ancorada, não flutuante.** A barra flutuante deixa uma faixa de mapa embaixo onde ninguém consegue tocar e torna as zonas reservadas instáveis. Ancorada, a borda de cima é uma linha fixa para sheets, coluna e ornamentos se apoiarem.
**UX-H4. Sticker do "Novo pico" dentro da barra.** O botão central "saltado" é comum, mas invadiria a zona dos controles e do sheet (sobreposição). O destaque vem de cor, borda, sombra e giro, não de sair da barra.
**UX-H5. Coluna embaixo à direita, localização mais baixa.** Polegar direito alcança; localização é a mais usada, fica mais perto. Ela sobe com o sheet e some quando não cabe, em vez de ficar meio coberta.
**UX-H6. Fita de placar no topo.** Responde "quantos picos e por quê" de uma vez (a causa mais comum de "sumiram os picos" é filtro esquecido, UX-P14). A fita amarela é o toque de rua mais visível da Home sem colocar textura no mapa (D41) e com contraste de 11,57:1.
**UX-H7. Contagem "na área" é da área visível.** "Carregados" hoje é o banco inteiro (a query não usa a área), um número que cresce sem dizer nada sobre a tela. O que está na tela é o que a pessoa quer saber; é calculado no cliente.
**UX-H8. Títulos de seção do filtro em fita com Inter, não em Permanent Marker.** O DS limita a fonte de tag a 24 px ou mais e a títulos de tela (D41). Quatro títulos de seção a 24 px em marcador deixariam o sheet pesado e o empurrariam para fora do SE. A fita dá o visual de rua; o título do sheet leva o marcador. Alternativa em P2.
**UX-H9. Adesivo "cola" ao marcar.** Marcado = amarelo + borda + sombra + check + giro. Vários sinais, nenhum só de cor, e a metáfora (colar adesivo) é da cultura de rua.
**UX-H10. Erro sem fita e sem gíria.** D42: em erro a pessoa precisa entender o que fazer; a identidade sai do caminho.
**UX-H11. Toast embaixo à esquerda.** No topo o toast cobre a busca (bug atual). Embaixo, à esquerda da coluna, não cobre nada e fica perto de onde a ação aconteceu.
**UX-H12. Sheets acima da tab bar, véu sem cobrir a tab bar.** Regra do dono (nada cobre a tab bar) e GP-108. Tocar numa aba fecha o sheet, que é o que a pessoa espera.
**UX-H13. Três camadas sobre o mesmo Standard.** Ver seção 12.
**UX-H14. Camada troca na hora, sheet fica aberto.** Escolher mapa é comparar; aplicar e fechar a cada toque obrigaria a reabrir. Sem botão "Aplicar".
**UX-H15. Permissão negada vira sheet com "Abrir ajustes".** O toast não tinha ação; o sheet resolve o problema em um toque (D38).
**UX-H16. Ornamentos do Mapbox de volta.** Logo e atribuição são exigidos pelos termos do Mapbox; hoje estão desligados. Reservamos a zona para não virar sobreposição depois.
**UX-H17. Pins e polígonos com borda e traço de rua, sem textura.** D41: no mapa só pins, polígonos e controles. Borda `ink`, sombra rígida e tracejado dão o ar de adesivo/spray e ainda melhoram a leitura no satélite.
**UX-H18. Web só adapta a navegação existente.** A sidebar já existe; reduzi-la aos mesmos 3 itens dá paridade sem criar componente novo. Marcado para aprovação.
**UX-H19. Prévia ao vivo dos filtros.** O dono pediu que marcar um adesivo atualize a contagem do topo. Como todos os picos já estão no cliente, a prévia é grátis e responde "quantos picos vou ver?" antes de aplicar; o "Aplicar" continua existindo para não recarregar a query do backend a cada toque (UX-P14).

## 14. Decisões do dono sobre a Home (2026-10-23)

O dono aprovou o protótipo ("o protótipo está perfeito"), ou seja, as recomendações padrão abaixo:
1. **P2. Títulos de seção do filtro:** fita com Inter (UX-H8).
2. **P3. Terceira camada:** Concreto (monocromático).
3. **P4. Lembrar a camada escolhida:** **no aparelho**, entre aberturas do app. O dono decidiu explicitamente.
4. **P5. Rótulo da aba:** "Novo pico".
5. **P6. Contagem:** "picos na área" (picos visíveis no mapa).
6. **P7. Web:** sidebar com os 3 itens; camadas como Dialog do Radix com identidade, como no protótipo.
7. **P8. Tokens novos** da seção 11 entram no DS v3 (GP-102).

Pendente:
8. **P9. Figma:** desenhar os frames a partir do protótipo quando houver cota (upgrade ou renovação do plano Starter).

## 15. Fora de escopo / pós-MVP
Seguir a direção da bússola no botão de localização; camada de "picos com foto"; mapa 3D; lista de picos próximos; tablets e paisagem.

## 16. Protótipos e Figma

- **Protótipo HTML (referência visual desta spec):** `docs/design/prototipos/home.html`. Arquivo único, sem dependências além do Google Fonts (Inter e Permanent Marker); mapa simulado em SVG. Mostra a Home mobile em 3 aparelhos (iPhone SE 375 x 667, Android 360 x 640 com navegação de 3 botões, iPhone com Dynamic Island 393 x 852) e a adaptação web em 1280 x 800.
  - **Topo do protótipo:** tema claro/escuro; seletor de estado (repouso, 2 filtros aplicados, resumo em peek, sheet de camadas, sheet de filtros e filtros expandido, carregando, zero picos, zero por filtro, erro, offline, localização buscando/localizado/permissão negada com sheet "Abrir ajustes", toast com resumo aberto, teclado na busca); "Mostrar zonas reservadas" (sobrepõe Z0 a Z7 em cada moldura e as zonas do web); e as alternativas P2, P3, P5 e P6.
  - **Interativo:** pins abrem o resumo, toque no mapa fecha; Camadas e Filtros abrem e fecham os sheets (Dialogs no web); a camada troca o mapa simulado; adesivos marcam e desmarcam e atualizam a fita, os chips, os pins e o "Ver N picos"; "Aplicar", "Limpar", remover chip, a alça para expandir, localização (buscando e depois localizado), busca com teclado e as abas também funcionam.
  - Link direto para um estado: `home.html#estado=peek&tema=escuro&zonas=1&camada=sat` (`estado` = valor do seletor; `camada` = `rua`, `sat` ou `third`).
- **Figma (DS):** https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN , página "Telas" (`19:2`). **Frames ainda não criados.** Na primeira tentativa, a sessão foi aberta e a listagem das páginas funcionou; a chamada seguinte (`get_metadata` da página "Telas") retornou: *"You've reached the Figma MCP tool call limit on the Starter plan. Upgrade your plan for more tool calls"*. O modelo do dono (https://www.figma.com/design/3VexamkeziZHB1RPfTKedg/GO-picos?node-id=16-37) também não pôde ser lido. Quando houver cota, desenhar a partir do protótipo: os mesmos estados, claro e escuro, com as zonas Z0 a Z7 em camada de anotação, e o web em 1280 e 768.
