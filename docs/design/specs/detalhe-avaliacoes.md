# Spec de UX - Detalhe do pico e avaliações com identidade de rua, sheets e zonas reservadas

Issue: #184 (GP-107). Atualiza a `picos.md` 5 e 9A e a `picos-fechamento.md` 3, 6 e 10 com a identidade de rua (E8), os sheets do mobile, os Dialogs com identidade do web e as zonas reservadas. **Onde esta spec divergir delas, vale esta.** Decisões novas: **UX-D1 a UX-D12** (seção 9).
Base: `design-system.md` v2.0 (seção 13), `specs/home.md` (tokens novos da seção 11) e a anatomia de sheet e Dialog da `specs/criar-editar-pico.md` 1 (proposta para o GP-103, repetida aqui em resumo para esta spec ficar autocontida).
Decisões do dono aplicadas: D38 (sheet no mobile, Dialog no web), D39 (exceções: visualizador de fotos em tela cheia), **D40** (sem sheet sobre sheet: a confirmação troca o conteúdo do mesmo sheet), **D41** (fonte de tag nunca no nome do pico nem nas avaliações), D42 (gíria só em vazio, convite e sucesso), D43.
**Referência visual: protótipo HTML `docs/design/prototipos/detalhe-avaliacoes.html`** (Figma MCP sem cota no plano Starter; HTML autorizado pelo dono). Ver seção 11.

---

## 0. Cobertura dos critérios da #184

| Critério | Onde |
|---|---|
| Identidade no detalhe (título de tela, chips como sticker, cabeçalho) **sem** fonte de tag no nome do pico nem nas avaliações | Seção 2 |
| Formulário de avaliação, excluir avaliação, excluir pico e menu de ações do autor: sheets no mobile, Dialogs com identidade no web | Seções 3, 4 e 6 |
| Descarte de avaliação em edição segue a D40 | Seção 3.4 |
| Teclado aberto com o sheet de avaliação e o botão Enviar visível | Seção 3.3 e 5; estados `avKb` e `avEditar` do protótipo |
| Dono aprova antes de GP-116 e das histórias de identidade do detalhe | Seção 10 |

## 1. Anatomia usada (resumo; detalhe em `criar-editar-pico.md` 1)
- **Sheet seletor** (menu de ações): título Permanent Marker 26 + spray, X 48, opções `ActionRow` de 64 com ícone em adesivo, Cancelar `secondary`; borda superior 2 `sticker-outline`; meio-tom no canto.
- **Sheet de formulário** (avaliação, novo tipo): como o seletor, com **rodapé fixo do sheet** (`BottomSheetFooter`) que acompanha o teclado.
- **Sheet de confirmação** destrutiva: fita zebrada (`CautionTape`) no topo, ilustração 44, título Inter 20/700, texto Inter 16, destrutivo em cima e seguro embaixo, foco inicial no seguro, sem gíria.
- **Véu e topo máximo:** o véu começa na base do header; nenhum sheet passa de `base do header + 8`; tocar em Voltar com sheet aberto fecha só o sheet.
- **Web:** Dialog Radix com borda 2 `sticker-outline`, sombra rígida `6px 6px 0`, raio 12; confirmação com fita zebrada e `role="alertdialog"`; formulário com título em Permanent Marker 28 + spray; véu só abaixo do header de 64.

## 2. Detalhe do pico (mobile)

### 2.1 Hierarquia
1. **Galeria** 260, largura total, com **degradê escuro** no topo (`rgba(0,0,0,.45)` a 0 em 120) para a status bar e os botões ficarem legíveis sobre qualquer foto. Contador em **fita** "1 / 4" no canto inferior direito (Inter 13/700 `ink` sobre `brand-yellow`; leitor: "Foto 1 de 4"). Tocar abre o visualizador em tela cheia (exceção D39, sem mudança).
2. **Header** (Z1, `insets.top` a `insets.top + 64`):
   - Sobre a galeria: sem fundo; **Voltar** à esquerda e, só para o autor, **"Ações do pico" (⋯)** à direita, ambos em **adesivo circular** 48 (fundo `surface`, borda 2 `sticker-outline`, sombra rígida 2 px).
   - Depois de rolar além da galeria (200): vira barra sólida `surface` com borda inferior 2 `sticker-outline`, Voltar, **nome do pico em Inter 17/700** (uma linha, reticências) e ⋯ (autor). Transição de 150 ms (sem animação com "reduzir movimento").
3. **Chips como adesivos:** modalidade (`brand-yellow`, borda 2 `ink`, sombra rígida, giro -2), "Gratuito"/"R$ 20" e "Coberto" (fundo `surface`, borda 2 `sticker-outline`, giros +1,5 e -1). Não são interativos.
4. **Nome do pico em Inter 26/800** (`h1`, até 3 linhas). **Sem Permanent Marker** (D41: conteúdo do usuário). O meio-tom fica no canto superior direito do bloco, fora do texto.
5. Nota: `StarRating` 16 + "4,6" + "· 23 avaliações"; "Criado por Marina S." (`caption`).
6. Descrição (Inter 16/24).
7. **"Informações"** como **fita de seção** (`TapeLabel`, Inter 14/700 `ink` sobre `brand-yellow`, mesmo da `home.md` 6.9) + 4 `InfoRow`.
8. **"Onde fica"** (fita) + mini-mapa 150 com borda 2 `sticker-outline` e raio 12.
9. **"Avaliações"**: **título fixo em Permanent Marker 28 + spray** (o único título de marca da tela, D41), resumo (média Inter 40/800, `StarRating` 18, "23 avaliações"), minha avaliação, lista (seção 4).
10. **Barra fixa** (Z6): fundo `surface`, borda superior 2 `sticker-outline`, botão primário **"Avaliar este pico"** com ícone de estrela; com avaliação minha: "Ver minha avaliação" (`secondary`, rola até o cartão). **Ausente para o autor** do pico.

As ações "Editar" e "Excluir" do autor **saem do meio da página** e vão para o menu ⋯ do header (seção 6).

### 2.2 Estados (complementa a picos.md 5.3)
| Estado | Descrição |
|---|---|
| Carregando | Skeleton (galeria e blocos `sunken`), sem a fita do contador; header sobre a galeria com Voltar |
| Não encontrado | Título "Pico não encontrado" em Inter 24/800 (é erro, sem marca nem gíria), ilustração do cone, "Ele pode ter sido excluído ou o link está errado.", [Voltar ao mapa] |
| Erro de rede | `AlertBanner` + "Tentar novamente" |
| Foto com falha | tile `sunken` com "Não foi possível carregar a foto" (toque recarrega) |
| Autor desativado | "Criado por Usuário Desativado" |

## 3. Formulário de avaliação (mobile: sheet de formulário; web: Dialog)

### 3.1 Conteúdo
- Título **"Avaliar este pico"** / **"Editar sua avaliação"** em Permanent Marker 26 + spray (título fixo; o conteúdo do usuário fica em Inter). X 48 à direita.
- **`StarInput`** v3: 5 estrelas de 36 com alvo 48; escolhida = preenchida `star` **com contorno 1,6 `ink`** (adesivo, e não só cor); vazia = contorno `border`. Abaixo, sem nota: dica "Escolha de 1 a 5 estrelas" (Inter 14 `text-muted`); com nota: **adesivo** com o rótulo ("Ruim", "Regular", "Bom", "Muito bom", "Excelente").
- **Comentário (opcional):** rótulo à esquerda e **contador "49/500" à direita na mesma linha** (economiza uma linha com teclado); `Textarea` mín. 96 (72 com teclado em tela baixa), cresce até 5 linhas e rola por dentro; borda 2 `error` e contador em `error` acima de 500.
- **Rodapé fixo do sheet** com **"Enviar avaliação"** / **"Salvar"** (primário, largura total), desabilitado sem nota. **O botão "Cancelar" sai** (UX-D4): fechar é pelo X, arraste para baixo ou toque no véu.

### 3.2 Alturas
- Repouso: altura do conteúdo (328) + rodapé 72 + `insets.bottom`.
- Com o teclado: `keyboardBehavior="interactive"`, `keyboardBlurBehavior="restore"`, `android_keyboardInputMode="adjustResize"`, `topInset = base do header + 8`. O sheet sobe até no máximo esse topo; o rodapé fica colado no teclado; o conteúdo rola dentro de `BottomSheetScrollView` para manter o comentário visível.

### 3.3 Teclado aberto (critério da issue)
- Título compacto: Permanent Marker 22, sem spray, linha de 40 (o X continua com alvo 48).
- Rodapé 64 (padding 8).
- Se a área útil entre o título e o rodapé for menor que 230, o conteúdo rola até o comentário (as estrelas sobem para fora; a nota escolhida continua indicada pelo adesivo ao rolar de volta). O campo e **"Enviar avaliação" ficam sempre visíveis** acima do teclado (posições na seção 5).

### 3.4 Descartar avaliação em edição (D40)
- Fechar (X, arraste, véu, Voltar) **com rascunho** (nota ou comentário diferentes do inicial): o sheet **não fecha**; o teclado fecha e **o conteúdo do mesmo sheet troca** pela confirmação (fita zebrada, cone, "Descartar sua avaliação?" / "A nota e o comentário que você escreveu vão se perder." / [Descartar] / [Continuar editando]). O sheet anima para a nova altura (270 + inset).
- "Continuar editando" volta ao formulário com nota e texto preservados e devolve o foco ao comentário; "Descartar" fecha.
- Sem rascunho: fecha direto.
- Implementação: `enablePanDownToClose` fica falso enquanto houver rascunho e o gesto chama a troca; o véu (`BottomSheetBackdrop`) usa `pressBehavior="none"` + `onPress` próprio. Substitui o `Alert.alert` de `ReviewFormSheet.tsx`.

### 3.5 Envio e erros (comportamento da picos.md 9A.2, sem mudança)
- Enviando: "Enviando..." em `loading`, campos somente leitura, sheet não fecha por gesto.
- Erro de rede: `AlertBanner` dentro do sheet, acima do rodapé; nada se perde.
- Sucesso: fecha; toast success **"Avaliação enviada!"** com complemento "Valeu por contar como é o pico." (D42 libera em sucesso) / "Avaliação atualizada."; média, contagem e pins atualizam sem recarregar.

## 4. Lista de avaliações e minha avaliação
- **Minha avaliação** em **cartão-adesivo**: borda 2 `sticker-outline`, sombra rígida 3 px, raio 12, adesivo "Sua avaliação" (`brand-yellow`), data `caption`, `StarRating` 16, comentário Inter 15, [Editar] e [Excluir] (ghost com borda, ícone, alvo 44; Excluir em `error`).
- **ReviewItem:** avatar de iniciais 36 com borda 2 `sticker-outline` ("?" e borda `border` para "Usuário Desativado"), nome Inter 15/600, data `caption`, `StarRating` 14, comentário Inter 15/22 com "Ver mais" após 3 linhas. **Nada de fonte de tag no texto das avaliações** (D41).
- **Vazio:** bloco tracejado 2 `sticker-outline` com a ilustração do shape (56), título **Inter 17/700 "Ninguém avaliou ainda"** e convite com gíria do glossário "Colou no pico? Conta pra galera como é andar aqui." (D42). O CTA é a barra fixa. Para o autor: só "Ainda sem avaliações."
- **Erro ao carregar:** `AlertBanner` sem gíria "Não foi possível carregar as avaliações." + "Tentar novamente"; o resto da tela continua.
- **Autor do pico:** `caption` "Você criou este pico, por isso não pode avaliá-lo." abaixo do resumo.
- Paginação: igual à picos-fechamento 10 (rolagem infinita no mobile, "Carregar mais" no web).

### 4.1 Excluir minha avaliação (sheet de confirmação; web: Dialog)
"Excluir sua avaliação?" / "Sua nota e seu comentário serão removidos. Você poderá avaliar de novo depois." / [Excluir avaliação] (destrutivo) / [Cancelar]. Fita zebrada, foco em Cancelar. Erro: banner dentro, sheet continua aberto. Sucesso: toast "Avaliação excluída.", a barra volta a "Avaliar este pico".

## 5. Zonas reservadas e posições calculadas (mobile, retrato)

Zonas: **Z0** status bar e base do sistema, **Z1** header (Voltar e ⋯), **Z4** toast, **Z5** sheet, **Z6** barra fixa (e o rodapé do sheet de formulário), **Z7** teclado. Regras: nada cobre Z1; o toast fica **8 acima da barra fixa** (ou da base da tela para o autor), largura total menos 32, até 3 linhas (96); com sheet aberto não há toast (erros do sheet são banners dentro dele).

| | iPhone SE 375 x 667 (top 20, bottom 0) | Android 360 x 640 (top 24, bottom 48) | Dynamic Island 393 x 852 (top 59, bottom 34) |
|---|---|---|---|
| Header (Z1) | 20 a 84 | 24 a 88 | 59 a 123 |
| Barra "Avaliar este pico" (Z6) | 595 a 667 | 520 a 592 (+ navegação 592 a 640) | 746 a 818 (+ home indicator) |
| Toast (Z4), x 16 a largura-16 | até 491 a 587 | até 416 a 512 | até 642 a 738 |
| Topo máximo de qualquer sheet | 92 | 96 | 131 |
| Sheet de avaliação, repouso (400 + bottom) | 267 a 667 | 192 a 640 | 418 a 852 |
| **Teclado aberto (Z7)** | 407 a 667 | 336 a 592 | 516 a 852 |
| **Sheet de avaliação com teclado (expandido)** | 92 a 407 | 96 a 336 | 131 a 516 |
| Rodapé "Enviar avaliação" com teclado | 343 a 407 | 272 a 336 | 452 a 516 |
| Área do comentário com teclado | 160 a 343 | 164 a 272 (comentário com 72) | 199 a 452 (sem rolar) |
| Menu "Ações do pico" (318 + bottom) | 349 a 667 | 274 a 640 | 500 a 852 |
| Confirmar exclusão do pico (290 + bottom; com erro 346) | 377 a 667 (321 com erro) | 302 a 640 | 528 a 852 |
| Excluir avaliação / descartar avaliação (274 / 270 + bottom) | 393 / 397 a 667 | 318 / 322 a 640 | 544 / 548 a 852 |

Todas as aberturas ficam abaixo do topo máximo; o Voltar e o ⋯ nunca ficam sob véu nem sob sheet. A barra fixa fica sob o véu enquanto um sheet está aberto (inerte, não é navegação).

## 6. Ações do autor do pico

### 6.1 Mobile: menu em sheet seletor
- Gatilho: botão **⋯ "Ações do pico"** no header (adesivo circular sobre a galeria; ícone na barra sólida). Só existe se `isOwner`.
- Sheet seletor **"Ações do pico"**: `ActionRow` **"Editar pico"** ("Nome, fotos, local e detalhes"; abre a edição) e **"Excluir pico"** (texto e ícone em `error`, adesivo do ícone em `error-soft` com borda `error`; "Remove o pico, as fotos e as avaliações"); [Cancelar].
- **"Excluir pico" troca o conteúdo do mesmo sheet** pela confirmação (D40), sem fechar e abrir outro: fita zebrada, "Excluir este pico?", "Esta ação não pode ser desfeita. O pico, as fotos e as avaliações dele serão removidos.", [Excluir pico] / [Cancelar], foco em Cancelar. Excluindo: "Excluindo..." em `loading`, sheet não fecha por gesto. Erro: banner "Não foi possível excluir. Tente novamente." dentro. Sucesso: volta à Home com toast "Pico excluído." (o `DeleteSpotSheet` atual vira esse conteúdo).

### 6.2 Web: sem menu
- Na coluna direita, abaixo do mini-mapa: [Editar pico] (`secondary`) e [Excluir pico] (ghost com borda, `error`), lado a lado, e o aviso "Você criou este pico, por isso não pode avaliá-lo." Em desktop há espaço e as ações visíveis são mais rápidas que um menu (UX-D7).
- Excluir abre o **Dialog de confirmação** 440 com identidade (fita zebrada, `alertdialog`, foco em Cancelar, Esc cancela).

## 7. Web (detalhe e avaliações)
- Duas colunas a partir de 1024 (680 + 408, como picos-fechamento 3). Galeria com **borda 2 `sticker-outline`**, raio 12 e fita "1 / 4"; miniaturas com contorno `primary` na selecionada. Lightbox em tela cheia segue como exceção (D39).
- Coluna direita: "Voltar ao mapa", chips-adesivo, **nome em Inter 34/800**, nota (link "23 avaliações" rola até a seção), "Informações" em fita, `InfoRow`s, mini-mapa com borda 2, autor, [Avaliar este pico] / [Ver minha avaliação], ações do autor. Meio-tom no canto superior direito.
- Coluna esquerda: descrição e a seção "Avaliações" (título Permanent Marker 28 + spray, cartão "Sua avaliação", lista, [Carregar mais]).
- **Dialog de avaliação** 480 (GP-116): título de marca + spray, meio-tom, X, `StarInput` (setas mudam a nota), comentário com contador, rodapé [Cancelar] [Enviar avaliação]. Fechar com rascunho (Esc, X, Cancelar, clique fora): **o conteúdo do mesmo Dialog troca** pela confirmação de descarte (mesma regra da D40 no web, para os dois produtos se comportarem igual).
- Dialogs de excluir avaliação e excluir pico: confirmação 440 (seção 1).
- Toast (sonner) no canto inferior esquerdo, 24 das bordas, nunca sobre o header.
- Abaixo de 640: Dialogs viram sheets com a anatomia do mobile; a coluna única segue a ordem do mobile, sem barra fixa (o botão fica após as informações).

## 8. Microcopy (PT-BR)

| Onde | Texto |
|---|---|
| Galeria | fita "1 / 4" (leitor: "Foto 1 de 4") |
| Header | "Voltar", "Ações do pico" (rótulos) |
| Seções | "Informações", "Onde fica", "Avaliações" |
| Barra | "Avaliar este pico", "Ver minha avaliação" |
| Formulário | "Avaliar este pico" / "Editar sua avaliação", "Escolha de 1 a 5 estrelas", "Ruim", "Regular", "Bom", "Muito bom", "Excelente", "Comentário (opcional)", placeholder "Como é o chão, os obstáculos, o rolê?", "49/500", "Enviar avaliação", "Salvar", "Enviando..." |
| Descartar (sem gíria) | "Descartar sua avaliação?" / "A nota e o comentário que você escreveu vão se perder." / "Descartar" / "Continuar editando" |
| Minha avaliação | "Sua avaliação", "Editar", "Excluir" |
| Excluir avaliação | "Excluir sua avaliação?" / "Sua nota e seu comentário serão removidos. Você poderá avaliar de novo depois." / "Excluir avaliação" / "Cancelar" |
| Ações do pico | "Ações do pico", "Editar pico" / "Nome, fotos, local e detalhes", "Excluir pico" / "Remove o pico, as fotos e as avaliações", "Cancelar" |
| Excluir pico | "Excluir este pico?" / "Esta ação não pode ser desfeita. O pico, as fotos e as avaliações dele serão removidos." / "Excluir pico" / "Excluindo..." / "Cancelar" |
| Vazio | "Ninguém avaliou ainda" / "Colou no pico? Conta pra galera como é andar aqui."; autor: "Ainda sem avaliações." |
| Sucesso | "Avaliação enviada!" + "Valeu por contar como é o pico."; "Avaliação atualizada."; "Avaliação excluída."; "Pico excluído." |
| Erros (sem gíria) | os da picos.md 9A e 8 (sem mudança) |

## 9. Decisões e justificativas

**UX-D1. Nome do pico em Inter, título de marca em "Avaliações".** D41 proíbe a fonte de tag em conteúdo do usuário, e nomes longos em marcador ficariam ilegíveis. A identidade fica nos títulos fixos: um título de marca por tela ("Avaliações", a seção mais "da galera") e fitas nos títulos menores, o mesmo padrão aprovado nos filtros da Home (UX-H8).
**UX-D2. Header sobre a galeria com adesivos circulares e degradê.** A foto é o argumento para ir ao pico, então ela ocupa o topo; os adesivos com borda e sombra rígida são legíveis sobre qualquer foto e conversam com os controles do mapa. O degradê garante o contraste da status bar sem escurecer a foto toda.
**UX-D3. Header vira barra sólida ao rolar.** Sem a foto atrás, os adesivos soltos ficariam sobre texto; a barra com o nome mantém o contexto e uma borda fixa para as zonas.
**UX-D4. Enviar no rodapé fixo do sheet, sem botão Cancelar.** O critério exige Enviar visível com teclado; no fim do conteúdo ele some. Sem o Cancelar sobram 56 px, o que faz caber no Android 360 x 640. Fechar continua com três caminhos (X, arraste, véu) e com a proteção da D40.
**UX-D5. Estrela escolhida com contorno `ink`.** A diferença entre preenchida e vazia não depende só da cor amarela (que some sob sol), e o contorno é o mesmo traço de adesivo do resto da identidade.
**UX-D6. Ações do autor num menu ⋯ no mobile.** Tira duas ações raras e uma delas destrutiva do meio da leitura, deixa o detalhe igual para autor e visitante e cumpre o critério (menu como sheet). O ⋯ espelha o Voltar, padrão conhecido.
**UX-D7. Sem menu no web.** No desktop há espaço; ações visíveis evitam um clique e um componente a mais. A confirmação destrutiva continua em Dialog.
**UX-D8. Excluir pico troca o conteúdo do mesmo sheet.** Aplica a D40 (sem sheet sobre sheet) e mantém a pessoa no mesmo lugar visual.
**UX-D9. Descarte também troca o conteúdo no Dialog do web.** Um Dialog sobre outro é o equivalente web do sheet sobre sheet; tratar igual simplifica o componente e o comportamento esperado.
**UX-D10. Cartão "Sua avaliação" como adesivo.** Destaca o que é da pessoa sem cor extra, com a mesma borda/sombra dos controles.
**UX-D11. Vazio com gíria, erro sem.** D42: o vazio é convite ("Colou no pico?"), o erro precisa ser claro.
**UX-D12. Título compacto com teclado.** Mantém o título visível (o leitor de tela e a pessoa sabem onde estão) e libera espaço para o campo e o botão.

## 10. O que o dono precisa avaliar (antes de GP-116 e das histórias de identidade do detalhe)
- **P-D1.** Ações do autor no menu ⋯ (mobile) e visíveis no web (UX-D6, UX-D7).
- **P-D2.** Remover o botão "Cancelar" do formulário de avaliação no mobile (UX-D4). Alternativa: Cancelar como link no rodapé ao lado de Enviar (não cabe bem no Android 360 com teclado).
- **P-D3.** "Avaliações" como o título de marca da tela e o nome do pico em Inter (UX-D1).
- **P-D4.** Complemento do toast de sucesso "Valeu por contar como é o pico." (pode ficar só "Avaliação enviada!").
- Visual geral: header sobre a galeria, chips-adesivo, cartão "Sua avaliação", sheet de avaliação com teclado.

## 11. Protótipo e Figma
- **Protótipo HTML:** `docs/design/prototipos/detalhe-avaliacoes.html`. Arquivo único (só Google Fonts de fora). Cada estado em iPhone SE 375 x 667, Android 360 x 640 e iPhone com Dynamic Island 393 x 852, mais o web 1280 x 800; tema claro/escuro e "Mostrar zonas reservadas" no topo. Interativo: "Avaliar este pico" abre o sheet, X com rascunho mostra o descarte (D40), ⋯ abre o menu, "Excluir pico" troca o conteúdo, "Editar"/"Excluir" no cartão "Sua avaliação". Link direto: `detalhe-avaliacoes.html#estado=avKb&zonas=1`.
  - Teclado aberto com o sheet expandido e o Enviar visível: `avKb`, `avEditar`.
- **Figma:** https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN (página "Telas"). **Frames não criados:** o MCP do plano Starter retornou "You've reached the Figma MCP tool call limit on the Starter plan" nesta rodada. Desenhar a partir do protótipo quando houver cota.

## 12. Ideias pós-MVP
Distribuição das notas (barras 1 a 5); reagir a uma avaliação ("útil"); fotos nas avaliações; denunciar avaliação.
