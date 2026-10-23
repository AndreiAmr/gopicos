# Spec de UX - Criar e editar pico com identidade de rua, sheets e zonas reservadas

Issue: #183 (GP-106), segunda e última parte. A Home (mapa) já foi entregue em `specs/home.md` (PR #210, aprovada pelo dono e implementada no PR #211); este documento completa o que faltava da issue: **criar pico (passos 1 e 2), editar pico, alterar local, confirmações de descarte e escolha de foto**, mais a **busca de lugar no web**.
Base: `design-system.md` v2.0 (seção 13, camada de marca), `specs/picos.md` (6 e 7), `specs/picos-fechamento.md` (4 e 5) e `specs/home.md` (zonas Z0 a Z7, tokens novos da seção 11). **Onde esta spec divergir delas para estes fluxos, vale esta.** Decisões novas: **UX-C1 a UX-C14** (seção 10).
Decisões do dono aplicadas: D38 (sheet no mobile, Dialog no web), D39 (exceções: câmera, galeria, permissões, sugestões da busca), D40 (sem sheet sobre sheet), D41 (fonte de tag só em títulos fixos), D42 (gíria nunca em erro/exclusão), D43 (Permanent Marker nos títulos).
**Referência visual: protótipo HTML `docs/design/prototipos/criar-editar-pico.html`** (o Figma MCP do plano Starter bateu o limite de chamadas de novo; o dono já autorizou o HTML como alternativa). Ver seção 12.

---

## 0. Cobertura dos critérios da #183

| Critério | Onde |
|---|---|
| Home: pins/polígonos e controles no estilo de rua | `home.md` 6.3 e 6.6 (aprovado, implementado no #211) |
| Mobile: resumo do pico em sheet peek; busca, filtros e camadas como sheets | `home.md` 6.5, 6.7 e 6.9. A busca segue inline (exceção D39), `home.md` 6.4 |
| Web: filtros e busca de lugar com a identidade | Filtros: `home.md` 10. **Busca de lugar: seção 7.4 desta spec** (faltava) |
| Posições de FAB, controles, header, tab bar, toast e sheet aberto sem sobreposição, em 375 x 667 e 360 x 640 | Home: `home.md` 4 (o FAB saiu, UX-H1). **Criar/editar: seção 6 desta spec** |
| Criar/editar: confirmações de descarte e escolha de foto como sheets (mobile) e Dialogs com identidade (web) | Seções 2.4, 3.4, 3.5, 4 e 7 |
| Cada frame mostra teclado aberto e sheet expandido | Protótipo: estados "teclado aberto" (passo 2, editar) e "painel expandido" (passo 1, alterar local); seção 6 |
| Dono aprova antes de GP-113, GP-114, GP-117 e das histórias de identidade do mapa e de criar/editar | Seção 11 |

## 1. Anatomia de sheet e Dialog usada aqui (proposta para consolidar no GP-103)

O GP-103 (BottomSheet e Dialog do DS v3) ainda está aberto. Para não deixar os devs adivinharem, esta é a anatomia que os fluxos desta spec usam; as specs de detalhe/avaliações (#184) e de autenticação/perfil (#182) usam a mesma. Quando o GP-103 for publicado, ele vira a fonte única e estas seções passam a apontar para ele.

### 1.1 Mobile: quatro tipos de sheet (todos sobre `@gorhom/bottom-sheet`, componente `BottomSheet` do DS)
| Tipo | Véu | Snap points | Título | Uso nesta spec |
|---|---|---|---|---|
| **Persistente** (ferramenta) | nenhum, a tela atrás continua usável | 2: compacto e expandido | sem título (o título é o da tela) | painel do passo 1 / alterar local |
| **Seletor** (picker, menu de ações) | `map-dim` | 1: altura do conteúdo | **Permanent Marker 26** + spray curto, botão X 48 | Adicionar foto |
| **Confirmação** | `map-dim` | 1: altura do conteúdo | **Inter 20/700** (é aviso, D41/D42), ilustração vetorial 44 à esquerda | descartar local, cadastro, alterações |
| **Aviso com ação** | `map-dim` | 1 | Inter 20/700 + ilustração | localização negada |

Regras comuns:
- **Cantos e borda:** raio 20 no topo; tipos persistente e seletor ganham borda superior 2 `sticker-outline` (mesma linha da tab bar), o que deixa o sheet "colado" na tela como adesivo.
- **Fita zebrada** (`caution`, novo asset vetorial, amarelo `brand-yellow` + `ink` a 45 graus, 10 de altura) no topo **só de confirmações destrutivas**. É o sinal de "atenção" da identidade (fita de obra, comum nos picos de rua), decorativa e oculta do leitor de tela; o texto e o botão vermelho continuam carregando a informação.
- **Meio-tom** a 30 a 38% no canto superior direito dos seletores (DS 13.4), nunca atrás de texto.
- **Ordem dos botões em confirmação:** destrutivo em cima (`Button destructive`, 48, largura total), "Continuar editando"/"Cancelar" embaixo (`secondary`). **Foco inicial no botão seguro.** Mesma ordem do `DeleteSpotSheet` atual (PR #177), para não haver dois padrões.
- **Fechar:** arrastar para baixo, toque no véu, X (seletor), botão voltar do Android; nunca durante um envio.
- **Sem empilhar (D40):** abrir um sheet modal fecha o teclado antes (`Keyboard.dismiss()`); um sheet modal nunca abre outro sheet; se uma ação dentro dele precisa de confirmação, o conteúdo do mesmo sheet troca.
- **Véu e navegação (regra nova, igual à da tab bar em `home.md` Z6):** o véu e o sheet **nunca cobrem o header da tela** (voltar e título). O véu começa na base do header; o topo máximo de qualquer sheet é `base do header + 8`. Tocar em Voltar com sheet modal aberto **fecha só o sheet** (um gesto, uma ação, igual ao botão voltar do Android).
- **Rodapé e safe area:** o conteúdo do sheet termina em `16 + insets.bottom` (home indicator, barra de 3 botões do Android).

### 1.2 Web: Dialog (Radix, D38)
- Largura 440 (confirmação) ou 480 a 560 (formulário). Raio 12, **borda 2 `sticker-outline` e sombra rígida `6px 6px 0`** (`ink` no claro, `brand-yellow` no escuro): é o mesmo adesivo dos controles do mapa, em escala maior.
- Confirmação destrutiva: fita zebrada no topo, ilustração 48, título Inter 20/700, texto Inter 16, botões à direita (Cancelar/Continuar editando à esquerda, ação à direita), `role="alertdialog"`, foco inicial no seguro.
- Seletor/formulário: título em Permanent Marker 28 + spray, meio-tom no canto, X 40.
- **Véu só sobre a área de conteúdo** (abaixo do header de 64; ao lado da sidebar quando houver). Clicar no header ou na sidebar fecha o Dialog (Radix `onPointerDownOutside`); se a ação era navegar com formulário sujo, o próprio Dialog de descarte é quem responde.
- Abaixo de 640 px o Dialog vira sheet inferior (como já previsto na picos.md 9A.2), com a mesma anatomia do mobile.

## 2. Criar pico, passo 1 - Marcar o local (mobile)

### 2.1 Problemas do código atual que esta spec corrige
- O painel inferior (`templates/app/newSpot/location/index.tsx`) empilha instrução, contador e **cinco botões de 48** (Adicionar no centro, Desfazer, Limpar, Usar minha posição, Continuar) + respiros: **cerca de 400 px**. No SE (667) ele começa perto de 267, ou seja, cobre 60% do mapa.
- A **mira** está em `top: 50%` da tela (333 no SE), portanto **embaixo do painel**: a pessoa toca "Adicionar ponto no centro do mapa" sem ver onde o ponto vai cair. É uma sobreposição real.
- O header é um cartão flutuante com texto "Passo 1 de 2 - Marque o local" em `label`, sem identidade.
- Logo e atribuição do Mapbox estão desligados (`logoEnabled={false}`), contra os termos do Mapbox (mesmo problema da Home, UX-H16).

### 2.2 Hierarquia
1. **Header** ancorado (`insets.top + 64`, fundo `surface`, borda inferior 2 `sticker-outline`, meio-tom no canto direito): Voltar 48, **título de tela "Marque o local"** em Permanent Marker 24 com spray curto abaixo, e a **fita "1 de 2"** à direita (Inter 13/700 `ink` sobre `brand-yellow`, giro -3 graus; rótulo de acessibilidade "Passo 1 de 2"). No passo 1 de edição o título é "Alterar local" e não há fita.
2. **Mapa** entre o header e o painel. Vértices: círculo 20 `surface` com borda 3 `ink` e o número do ponto (Inter 10/700); polígono `primary` 22% com contorno 2,5 (`home.md` 6.6).
3. **Mira** (componente `MapCrosshair`): anel tracejado 26 `ink` com halo branco + 4 traços `primary-text`, 44 x 44, **centralizada na área livre** (entre a base do header e o topo do painel), não no centro da tela.
4. **Coluna de controles** (Z2, mesma `MapControlButton` da Home): **Desfazer** (em cima, desabilitado sem pontos) e **Minha localização** (embaixo, centraliza o mapa; não cria ponto).
5. **Painel** = sheet **persistente**, dois snaps:
   - **Compacto** (156 + `insets.bottom`): alça; linha "4 pontos marcados" (Inter 16/600, `accessibilityLiveRegion="polite"`) com dica `caption` ("Marque pelo menos 3 pontos" / "Pode ajustar ou seguir.") e, com 3 pontos ou mais, o adesivo **"Local fechado"** (check + texto); linha de botões **[+ Adicionar ponto]** (`secondary`) e **[Continuar]** (primário, desabilitado com menos de 3).
   - **Expandido** (306 + `insets.bottom`): acrescenta a instrução ("Toque no mapa para marcar os cantos do pico ou use a mira. Arraste um ponto para ajustar."), o endereço sugerido (ícone de pin + "Perto de R. Augusta, 1200 · São Paulo") e a linha **[Limpar]** (ghost em `error`, com lixeira) e **[Minha posição]** (adiciona um ponto na posição do GPS, comportamento atual de "Usar minha posição").
   - Abre **compacto**. A alça (botão "Expandir ferramentas") e o arraste trocam o snap.
6. Logo e atribuição do Mapbox (Z3), 8 acima do painel, à esquerda.

### 2.3 Comportamento
- Toque no mapa adiciona vértice; arrastar o vértice move; "Adicionar ponto" cria o vértice **sob a mira** (rótulo de acessibilidade "Adicionar ponto no centro do mapa", anúncio "Ponto 4 adicionado").
- **Câmera:** `padding` da câmera = `{top: altura do header, bottom: altura do painel no snap atual, right: 16 + 48 + 8}`. Assim o "centro do mapa" usado por `addAtCenter` coincide com a mira e muda junto com o snap (hoje usa o centro da tela).
- A coluna acompanha o topo do painel (16 acima). Se o espaço entre a base do header + 16 e o topo do painel - 16 ficar menor que 104, a coluna some (opacidade 0, fora do foco), como na Home 4.2. Em nenhum dos aparelhos-alvo isso acontece com o painel expandido (seção 6).
- Voltar com pontos marcados abre a confirmação (2.4). Sem pontos, volta direto.

### 2.4 Confirmação "Descartar o local marcado?" (sheet de confirmação, substitui `Alert.alert`)
Ilustração do cone (44), título **"Descartar o local marcado?"**, texto "Os 4 pontos que você marcou vão se perder." (número real), **[Descartar]** (destrutivo) e **[Continuar editando]**. Fita zebrada no topo. Véu a partir da base do header. Em "Alterar local": "Descartar a alteração do local?" / "O pico continua com o local de antes."

### 2.5 Localização negada (sheet de aviso com ação)
Igual à Home 6.8, com texto do fluxo: título "Ative a localização", texto "Assim dá para marcar o pico onde você está. Ative nos ajustes do aparelho.", [Abrir ajustes] (primário) e [Agora não] (ghost). Ilustração do shape (44). A tela do sistema pedindo permissão continua nativa (D39).

### 2.6 Estados
| Estado | Painel | Mapa |
|---|---|---|
| 0 pontos | "Nenhum ponto marcado" + "Marque pelo menos 3 pontos"; Continuar desabilitado; Desfazer desabilitado | mira |
| 1 a 2 pontos | contador; Continuar desabilitado | vértices; 2 pontos ligados por traço tracejado |
| 3+ pontos | adesivo "Local fechado"; Continuar habilitado | polígono fechado |
| Buscando endereço | linha do endereço com "Buscando endereço..." | |
| Endereço indisponível | a linha some (não é erro; o endereço é só ajuda) | |
| Erro de localização | toast error em Z4 "Não foi possível achar sua localização. Tente de novo." | |
| Sem token do Mapbox | `AlertBanner` existente no lugar do mapa | |

## 3. Criar pico, passo 2 - Detalhes e fotos (mobile)

### 3.1 Hierarquia
1. **Header** igual ao do passo 1: Voltar, título "Detalhes do pico" (Permanent Marker 24 + spray), fita "2 de 2".
2. **Formulário rolável** (ordem da picos.md 6.2): cartão do local (mini-mapa 72 + "Local marcado" + "4 pontos · R. Augusta" + "Alterar"), **Fotos** (rótulo + "2 de 5 · até 5 MB cada", grade de 3 colunas com miniaturas de 100, **fita "Capa"** na primeira, X de 28 com alvo 44, bloco tracejado "Adicionar" com borda 2 `sticker-outline`), Nome, Descrição, Modalidade (adesivos `FilterChip` v3, escolha única), Entrada (`Segmented` sticker), Aberto 24 horas (`Switch`), Coberto e Exige equipamento (`Checkbox`).
3. **Rodapé fixo** (Z6, novo): fundo `surface`, borda superior 2 `sticker-outline`, padding 12/16, botão primário **"Criar pico"** largura total. Altura 72 + `insets.bottom` em repouso.

Identidade aplicada sem tocar nos campos: título de tela com marcador e spray, fita de passo, fita "Capa", adesivos de modalidade, bloco "Adicionar" tracejado com borda forte (lembra estêncil). Campos, rótulos, ajudas e erros continuam Inter (CT-ID).

### 3.2 Teclado
- O rodapé fica **colado no topo do teclado** (`KeyboardStickyView` ou `KeyboardAvoidingView` envolvendo só o rodapé) e o formulário rola para deixar o campo focado **16 abaixo do header** (`scrollToFocusedInput`, já existe no fluxo com `KeyboardAvoidingView`). Assim campo focado e botão principal ficam visíveis (CT-SOBREP).
- `returnKeyType="next"` em Nome, Valor e Horário; a Descrição quebra linha (Enter não envia) e cresce até 5 linhas, depois rola por dentro.
- Com teclado aberto não há tab bar (tela empilhada) e nenhum sheet aberto.

### 3.3 Validação, envio e falha (comportamento da picos.md 6.3/6.4; o que muda é o lugar)
- Erros sob o campo, Inter 12/600 `error` com ícone, borda 2 `error` no campo (nunca só cor). Ao tocar "Criar pico" com erro: rola até o primeiro inválido, foca e anuncia "Corrija os campos destacados". Fotos vazias: bloco "Adicionar" com borda `error` + "Adicione ao menos 1 foto.".
- **Enviando:** botão "Criando pico..." em `loading` (largura mantida), campos somente leitura, Voltar desabilitado.
- **Falha:** o `AlertBanner` "Não foi possível criar o pico. Seus dados foram mantidos." + "Tentar novamente" entra **dentro do rodapé, acima do botão** (o rodapé cresce 76). Assim ele aparece sem rolar e sem cobrir campos.
- **Sucesso:** vai ao detalhe do novo pico (`replace`) com toast success "Pico criado!" (gíria liberada em sucesso pela D42; texto curto, pode ser "Pico na área!" se o dono quiser, ver P-C3).

### 3.4 Escolher foto: câmera ou galeria (sheet seletor, substitui `Alert.alert` em `pickPhoto.ts`, GP-113)
- Abre ao tocar "Adicionar". Fecha o teclado antes.
- Título **"Adicionar foto"** (Permanent Marker 26 + spray), X 48, legenda "Faltam 3 de 5 fotos · até 5 MB cada".
- Duas opções grandes (`ActionRow`, componente novo: 64 de altura, raio 12, borda 1,5 `border`, ícone 22 num **adesivo amarelo** 44 com borda `ink` e giro, título Inter 16/600 + descrição `caption`, chevron):
  - **Tirar foto** - "Abre a câmera do aparelho"
  - **Escolher da galeria** - "Até 3 fotos de uma vez" (o número acompanha o que falta)
- [Cancelar] `secondary` no fim.
- Altura 344 + inset (SE: 323 a 667). A 130% de fonte: 406 + inset; se não couber abaixo de `base do header + 8`, o conteúdo rola dentro do sheet com Cancelar fixo.
- As telas da câmera e da galeria continuam nativas (D39). Se a permissão foi negada: o sheet troca o conteúdo (D40) para o aviso "Ative o acesso à câmera" / "à galeria" com [Abrir ajustes] e [Agora não].
- `accessibilityRole="button"` em cada opção; título anunciado ao abrir; foco volta ao bloco "Adicionar" ao fechar.

### 3.5 Descartar cadastro (sheet de confirmação)
Voltar com qualquer dado preenchido: **"Descartar este cadastro?"** / "O local, as fotos e os dados que você preencheu vão se perder." / [Descartar] / [Continuar editando]. "Descartar" volta à Home. (Voltar do passo 2 para o passo 1 pelo "Alterar" do cartão de local **não** descarta nada.)

## 4. Editar pico e Alterar local (mobile)

- **Editar pico:** mesmo formulário do passo 2, preenchido. Header com Voltar e título **"Editar pico"** (Permanent Marker 24 + spray), **sem fita de passo**. Rodapé fixo com **"Salvar alterações"** (já é assim no #170; o "Cancelar" do header vira o Voltar, que cobre o mesmo caso com uma ação a menos no topo).
- Teclado, erros, envio e falha como na seção 3 ("Salvando...", "Não foi possível salvar. Seus dados foram mantidos.").
- Remover a última foto: a foto não sai e aparece "O pico precisa ter ao menos 1 foto." sob a grade.
- **Descartar alterações** (sheet de confirmação, substitui `Alert.alert` de `useEditSpot.ts`): "Descartar alterações?" / "As mudanças que você fez neste pico não serão salvas." / [Descartar] / [Continuar editando].
- **Alterar local:** o editor do passo 1 em modo edição (título "Alterar local", sem fita, polígono atual com vértices numerados), botão principal **"Usar este local"**; descartar com "Descartar a alteração do local?".
- Sucesso: volta ao detalhe com toast "Alterações salvas." (zona de toast do detalhe, spec da #184).

## 5. Microcopy (PT-BR)

| Onde | Texto |
|---|---|
| Header | "Marque o local", "Detalhes do pico", "Editar pico", "Alterar local"; fita "1 de 2" / "2 de 2" (leitor: "Passo 1 de 2") |
| Painel | "Nenhum ponto marcado", "1 ponto marcado", "4 pontos marcados", "Marque pelo menos 3 pontos", "Pode ajustar ou seguir.", adesivo "Local fechado", "Adicionar ponto", "Continuar", "Usar este local", "Limpar", "Minha posição", "Toque no mapa para marcar os cantos do pico ou use a mira. Arraste um ponto para ajustar.", "Perto de {endereço}", "Buscando endereço..." |
| Coluna | "Desfazer último ponto", "Centralizar na minha localização" (rótulos de acessibilidade) |
| Fotos | "Fotos", "2 de 5 · até 5 MB cada", "Capa", "Adicionar", "Remover foto 2" |
| Sheet de foto | "Adicionar foto", "Faltam 3 de 5 fotos · até 5 MB cada", "Tirar foto" / "Abre a câmera do aparelho", "Escolher da galeria" / "Até 3 fotos de uma vez", "Cancelar" |
| Rodapé | "Criar pico", "Criando pico...", "Salvar alterações", "Salvando..." |
| Confirmações (sem gíria, D42) | "Descartar o local marcado?" / "Os {n} pontos que você marcou vão se perder."; "Descartar este cadastro?" / "O local, as fotos e os dados que você preencheu vão se perder."; "Descartar alterações?" / "As mudanças que você fez neste pico não serão salvas."; "Descartar a alteração do local?" / "O pico continua com o local de antes."; botões "Descartar" e "Continuar editando" |
| Avisos | "Ative a localização" / "Assim dá para marcar o pico onde você está. Ative nos ajustes do aparelho." / "Abrir ajustes" / "Agora não"; "Ative o acesso à câmera" / "Ative o acesso à galeria" |
| Erros | iguais à picos.md 6.3 e 6.4; "Não foi possível achar sua localização. Tente de novo."; "O pico precisa ter ao menos 1 foto." |
| Sucesso | "Pico criado!", "Alterações salvas." |

## 6. Zonas reservadas e posições calculadas

Zonas (mesma numeração da `home.md` 4, com duas novas): **Z0** status bar/notch e base do sistema, **Z1** header da tela, **Z2** coluna de controles, **Z3** logo e atribuição do Mapbox, **Z4** toast, **Z5** sheet/Dialog, **Z6 (nova) rodapé de ação fixo**, **Z7** teclado, **Z8 (nova) mira**. z-index: mapa 0, vértices 5, mira 6, controles 10, painel persistente 25, rodapé 28, header 30, véu 35, sheet modal 40, toast 60, teclado (sistema).

Regras: nada desenha dentro da zona de outro. A mira (Z8) é intocável: o painel, a coluna e o toast são posicionados a partir da área livre, e a mira é o centro dela. O toast fica em Z4 (à esquerda da coluna, 8 acima do logo, até 3 linhas) e nunca no topo, porque lá está o header.

### 6.1 Passo 1 / Alterar local (px, retrato)
Fórmulas: header = `top + 64`; painel compacto = `156 + bottom`, expandido = `306 + bottom`; coluna termina 16 acima do painel (2 x 48 + 8 = 104); logo 8 acima do painel (20 de altura); toast termina 8 acima do logo (até 96), x de 16 até `largura - 16 - 48 - 8`; mira no centro vertical entre header e painel.

| | iPhone SE 375 x 667 (top 20, bottom 0) | Android 360 x 640 (top 24, bottom 48) | Dynamic Island 393 x 852 (top 59, bottom 34) |
|---|---|---|---|
| Header (Z1) | 20 a 84 | 24 a 88 | 59 a 123 |
| Painel compacto (Z5) | 511 a 667 | 436 a 640 (conteúdo até 592) | 662 a 852 (conteúdo até 818) |
| Coluna Desfazer / Localização (Z2) | 391 a 439 / 447 a 495 | 316 a 364 / 372 a 420 | 542 a 590 / 598 a 646 |
| Logo Mapbox (Z3) | 483 a 503 | 408 a 428 | 634 a 654 |
| Toast (Z4) | 379 a 475, x 16 a 303 | 304 a 400, x 16 a 288 | 530 a 626, x 16 a 321 |
| Mira (Z8), centro | y 297 | y 262 | y 392 |
| **Painel expandido** | 361 a 667 | 286 a 640 | 512 a 852 |
| Coluna com painel expandido | 241 a 289 / 297 a 345 | 166 a 214 / 222 a 270 | 392 a 440 / 448 a 496 |
| Mira com painel expandido | y 222 (área livre 84 a 361) | y 187 (88 a 286) | y 317 |
| Sheet de confirmação (270 + bottom) | 397 a 667 | 322 a 640 | 548 a 852 |

Com painel expandido, a coluna cabe com folga nos três (SE: 241 - 100 = 141 livres acima dela). Nenhum elemento cobre o header, a coluna ou a mira.

### 6.2 Passo 2 / Editar
| | SE 375 x 667 | Android 360 x 640 | Dynamic Island 393 x 852 |
|---|---|---|---|
| Header (Z1) | 20 a 84 | 24 a 88 | 59 a 123 |
| Formulário (rolagem) | 84 a 595 | 88 a 520 | 123 a 746 |
| Rodapé (Z6), repouso | 595 a 667 | 520 a 592 + navegação 592 a 640 | 746 a 818 + home indicator |
| **Teclado aberto (Z7)** | 407 a 667 | 336 a 592 (navegação 592 a 640) | 516 a 852 |
| Rodapé com teclado | 335 a 407 | 264 a 336 | 444 a 516 |
| Área visível do formulário com teclado | 84 a 335 (251) | 88 a 264 (176) | 123 a 444 (321) |
| Sheet "Adicionar foto" (344 + bottom) | 323 a 667 | 248 a 640 | 474 a 852 |
| Sheet "Adicionar foto" a 130% (406 + bottom) | 261 a 667 | 186 a 640 | 412 a 852 |
| Sheet de confirmação | 397 a 667 | 322 a 640 | 548 a 852 |

Campo de uma linha com rótulo e ajuda = 94; Descrição focada = 26 + 120 + 20 = 166. Todos cabem na área visível com teclado, inclusive no Android 360 x 640 (176). Com o banner de falha (rodapé 148) e teclado aberto no Android, a área cai para 100: o banner **some quando o teclado abre** e volta ao fechar (ele já foi anunciado; a falha continua indicada pelo botão "Tentar novamente" no rodapé). Ver UX-C9.

Os sheets modais cobrem o rodapé "Criar pico": isso é esperado (o rodapé fica inerte sob o véu e não é navegação). O que não pode ser coberto é o header, e o topo de todos os sheets acima fica abaixo de `base do header + 8` (SE: 92).

## 7. Web

### 7.1 Passo 1 (`/spot/new-spot`) e Alterar local
- Header 64 do app. Mapa em toda a área abaixo. **Painel lateral** 360 (16 de margem) com a identidade do Dialog: borda 2 `sticker-outline`, sombra rígida 4 px, meio-tom no canto. Conteúdo: fita "Passo 1 de 2", **"Marque o local do pico"** em Permanent Marker 30 + spray, instrução (com "Ctrl+Z desfaz"), contador + adesivo "Local fechado", endereço, [Adicionar ponto no centro do mapa], [Desfazer] [Limpar], [Usar minha posição] e rodapé do painel com [Continuar] (borda superior 2).
- **Mira no centro da área à direita do painel** (padding da câmera `left: 392`), não no centro da janela.
- Controles no canto inferior direito, 24 das bordas: zoom +, zoom - e localização (`MapControlButton`). Logo do Mapbox à direita do painel. Toast no canto inferior esquerdo **da área do mapa** (à direita do painel), nunca sobre o painel nem sobre os controles.
- Localização bloqueada no navegador: `AlertBanner` info dentro do painel ("A localização está bloqueada neste navegador. Libere nas configurações do site para usar sua posição."). Não abre Dialog: o navegador não deixa reabrir o pedido, então não há ação a oferecer além da instrução.
- Abaixo de 768 o painel vira sheet persistente inferior (mesma anatomia do mobile, seção 2).

### 7.2 Passo 2 (`/spot/new-spot/details`) e Editar (`/spot/:id/edit`)
- Coluna de 560 centralizada; fita "Passo 2 de 2" (só no criar); título de tela **"Detalhes do pico"** / **"Editar pico"** em Permanent Marker 34 + spray; meio-tom no canto superior direito da página (fora da coluna).
- **Fotos:** área de arrastar-e-soltar 560 x 120 com borda tracejada 2 `sticker-outline` ("Arraste as fotos aqui ou" + [Escolher no computador]); ao arrastar por cima: fundo `brand-yellow` 28%, borda `primary` e "Solte para adicionar 2 fotos". Miniaturas 120 x 84 com fita "Capa" e X. **Não há Dialog de câmera/galeria no web:** o botão abre o seletor de arquivos do navegador (equivalente às telas nativas da D39; no celular o próprio navegador oferece câmera ou galeria).
- **Barra de ações fixa no rodapé** (criar e editar; UX-C6): 72, borda superior 2, botões alinhados à coluna: [Voltar] / [Cancelar] à esquerda e [Criar pico] / [Salvar alterações] à direita. Banner de falha entra na barra, acima dos botões.
- **Descartar** (bloqueio de navegação `useBlocker` e Cancelar com dados): Dialog de confirmação (seção 1.2) com os mesmos textos do mobile.

### 7.3 Dialogs do fluxo (os de `NewSpotLayout.tsx` + `atomic/molecules/modal.tsx`, GP-115)
Todos passam ao Dialog do DS (1.2): "Descartar o local marcado?", "Descartar este cadastro?", "Descartar alterações?", "Descartar a alteração do local?". O `beforeunload` (fechar aba) continua com o texto do navegador, fora de escopo (inventário do E8).

### 7.4 Busca de lugar no web (complemento da Home; Dialog "Locais encontrados" de `components/header/PlaceSearch`, GP-117)
- **O Dialog sai.** Os resultados passam a ser uma **lista inline sob o campo** (`role="combobox"` + `listbox`), como a picos.md 9 já especificava e como no mobile (D39: sugestões da busca não viram modal, para não esconder o mapa).
- Identidade: lista com borda 2 `sticker-outline`, sombra rígida 4 px, raio 12; cabeçalho `caption` 700 "LUGARES" e a dica de teclado "↑ ↓ para navegar · Enter escolhe · Esc fecha"; opção ativa com fundo `primary-soft` e barra laranja de 4 à esquerda (não só cor: a barra e o `aria-selected`). Até 5 itens de 56.
- Enquanto aberta, a lista passa por cima da linha Filtros/fita (é o mesmo campo que a pessoa está usando); fecha com Esc, clique fora ou escolha. Não cobre header, sidebar nem a coluna de controles.
- Estados: "Buscando...", "Nenhum lugar encontrado. Tente outro nome ou endereço.", erro "Não foi possível buscar agora." + "Tentar novamente", dentro da mesma lista.

## 8. Acessibilidade
- Alvos 48 (botões, coluna, opções do sheet 64, X da foto 44). Ordem de foco no passo 1: Voltar, Desfazer, Localização, painel (contador, Adicionar ponto, Continuar; expandido: Limpar, Minha posição). O mapa não é navegável; "Adicionar ponto" cobre o fluxo inteiro sem tocar no mapa.
- Contador e "Ponto N adicionado" anunciados (`polite`). Fita de passo com rótulo "Passo 1 de 2". Mira, spray, meio-tom, fitas decorativas e fita zebrada ocultos do leitor de tela.
- Contraste: `ink` sobre `brand-yellow` 11,57:1 (fitas, adesivos); `on-error` sobre `error` 6,68:1 (claro) e `bg` sobre `error` escuro acima de 8:1; borda `sticker-outline` sobre `surface` 17,72 / 15,97; contorno da mira com halo branco para leitura sobre o satélite.
- Nunca só cor: "Local fechado" tem texto e check; erro tem ícone e texto; opção ativa da busca tem barra.
- Fonte a 130%: títulos de tela em uma linha até ~18 caracteres a 24 px no SE ("Detalhes do pico" cabe); acima disso quebram em 2 linhas e o header cresce 28 (as fórmulas da seção 6 usam a altura real medida). Sheet de foto: ver 3.4.
- Reduzir movimento: troca de snap sem mola; câmera sem voo.

## 9. Componentes e tokens novos (para o DS v3)
- `MapCrosshair` (mira), `ActionRow` (opção de seletor com ícone em adesivo), `StepTape` (fita de passo; é o `Tape` do DS com texto informativo em Inter 13/700 `ink`), `CautionTape` (asset vetorial da fita zebrada), `FormFooter` (rodapé de ação fixo, Z6), `ScreenHeader` v3 (Voltar + título de marca + slot à direita, borda 2 e meio-tom).
- Nenhuma cor nova. Reusa `sticker-outline`, `sticker-shadow-sm`, `map-dim` e `z.tabBar` da `home.md` 11; acrescenta `z.formFooter` 28 e `z.persistentSheet` 25.

## 10. Decisões e justificativas

**UX-C1. Painel do passo 1 com dois tamanhos.** Hoje ele ocupa 60% do mapa no SE, justamente no passo em que o mapa é a ferramenta. Compacto (156) deixa à vista o que importa em 90% do tempo (marcar e continuar); o resto fica a um gesto. Mesmo padrão de peek/expandido do resumo da Home, então a pessoa já conhece.
**UX-C2. Desfazer e localização viram controles do mapa.** São ações sobre o mapa, usadas várias vezes seguidas; na coluna da direita ficam sempre no mesmo lugar (como na Home) e liberam duas linhas do painel.
**UX-C3. Mira no centro da área livre, com padding da câmera.** Corrige uma sobreposição real (mira sob o painel) e garante que o ponto criado cai onde a mira mostra, em qualquer snap e aparelho.
**UX-C4. Header ancorado com título de marca e fita de passo.** Dá a identidade de rua (D41 permite a fonte de tag em título fixo de tela) e uma borda fixa para as zonas, como a tab bar ancorada da Home (UX-H3). A fita "1 de 2" é curta para não truncar o título a 360 px.
**UX-C5. Rodapé de ação fixo no passo 2 e na edição.** O critério transversal exige o botão principal visível acima do teclado; no fim da rolagem ele some. A edição já fazia isso (UX-F7); agora criar e editar ficam iguais.
**UX-C6. Web também com barra fixa no criar.** Paridade com o mobile e com a edição web; formulário longo com o botão sempre à mão.
**UX-C7. Confirmações com fita zebrada, título em Inter e sem gíria.** D42 proíbe gíria em exclusão; D41 limita a fonte de tag. A fita de obra dá a cara de rua e sinaliza "atenção" sem depender do texto, e só aparece em ações destrutivas, para não perder força.
**UX-C8. Seletor de foto com título de marca e opções grandes.** Não é aviso, é uma escolha neutra: pode levar o marcador. Opções de 64 com ícone em adesivo são fáceis de acertar com o polegar e substituem o `Alert.alert` do sistema (D38).
**UX-C9. Banner de falha no rodapé, e escondido com teclado no Android pequeno.** No rodapé ele aparece sem rolar; com teclado no 360 x 640 ele comeria 76 dos 176 visíveis, então sai enquanto o teclado está aberto (o "Tentar novamente" continua no botão).
**UX-C10. Véu e sheets nunca cobrem o header; Voltar fecha o sheet.** Mesma regra da tab bar na Home, estendida às telas empilhadas: a navegação nunca fica escondida, e um toque faz uma coisa só.
**UX-C11. Sem Dialog de câmera/galeria no web.** O navegador já oferece o seletor (e câmera/galeria no celular); um Dialog intermediário seria um clique a mais sem informação nova.
**UX-C12. Busca de lugar no web vira lista inline.** Um Dialog modal esconde o mapa que a pessoa quer mover e cria um segundo padrão em relação ao mobile; a lista inline é o combobox acessível que a picos.md 9 já previa.
**UX-C13. Destrutivo em cima nas confirmações mobile.** Mantém o padrão já implementado no `DeleteSpotSheet` (#177); o risco de toque acidental é coberto pelo foco inicial no seguro, pela cor e pelo texto explícito.
**UX-C14. "Alterar local" sem fita de passo.** Na edição não há passos; a fita mentiria.

## 11. O que o dono precisa avaliar (antes de GP-113, GP-114, GP-117 e das histórias de identidade de criar/editar)
- **P-C1.** Painel do passo 1 com dois tamanhos e Desfazer/Localização na coluna (UX-C1, UX-C2). Recomendado: sim.
- **P-C2.** Fita zebrada nas confirmações destrutivas (UX-C7), em mobile e web. Alternativa: só a ilustração do cone, sem fita.
- **P-C3.** Toast de sucesso: "Pico criado!" (recomendado, direto) ou "Pico na área!" (com gíria, D42 permite em sucesso).
- **P-C4.** Busca de lugar no web como lista inline em vez de Dialog (UX-C12). Recomendado: sim.
- **P-C5.** Barra de ações fixa também no criar pico do web (UX-C6).
- Visual geral: header com título de marca e fita de passo; sheet "Adicionar foto"; rodapé fixo com teclado.

## 12. Protótipo e Figma
- **Protótipo HTML:** `docs/design/prototipos/criar-editar-pico.html`. Arquivo único, sem dependências além do Google Fonts (Inter e Permanent Marker). Mostra cada estado em **iPhone SE 375 x 667, Android 360 x 640 (3 botões) e iPhone com Dynamic Island 393 x 852**, mais o **web 1280 x 800**. Topo: tema claro/escuro, seletor de estado (com setas), "Mostrar zonas reservadas" (Z0 a Z8 desenhadas em cada aparelho). Interativo: Voltar abre o descarte, "Adicionar ponto" e Desfazer mudam o contador, a alça expande o painel, "Adicionar" abre o sheet de foto, Cancelar/Continuar editando fecham. Link direto: `criar-editar-pico.html#estado=p2Kb&tema=escuro&zonas=1`.
  - Estados com **teclado aberto:** `p2Kb` (Nome), `edKb` (Descrição). Estados com **sheet expandido:** `p1Exp`, `edLocalExp`; sheets modais de altura única: `p2Foto`, `p2Foto130`, `p1Desc`, `p2Desc`, `edDesc`, `edLocalDesc`, `p1Perm`.
- **Figma:** arquivo do DS https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN (página "Telas", `19:2`). Nesta rodada a sessão foi aberta e a listagem de páginas funcionou, mas a chamada seguinte voltou com *"You've reached the Figma MCP tool call limit on the Starter plan"*. **Frames não criados**; desenhar a partir do protótipo quando houver cota (mesma pendência P9 da Home).

## 13. Ideias pós-MVP
Desenhar o polígono arrastando o dedo (lasso); sugerir o contorno a partir do satélite; reordenar fotos e escolher a capa; rascunho salvo do cadastro.
