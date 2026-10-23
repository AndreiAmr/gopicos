# Spec de UX - Picos, fechamento (web, mobile, filtros, nota no mapa e avatar)

Complementa `docs/design/specs/picos.md` e `docs/design/specs/perfil.md` (ambas em `main`). Fecha as issues que estavam em "Em Design": #35, #38, #40, #44, #45, #47, #48, #49, #50, #56, #57, #58, #59, #60 e #72.
Base: `docs/design/design-system.md` v2.0. **Nenhum token novo.** Decisões novas: **UX-F1 a UX-F14** (seção 9). Onde esta spec e a `picos.md` divergirem, vale esta.
Protótipo: `docs/design/prototipos/picos-fechamento.html` (abrir no navegador). Figma: ver seção 13.

## 1. Mapa de cobertura (o que cada issue tem)

| Issue | Onde está o desenho | O que este documento acrescenta |
|---|---|---|
| #35 Home web | picos.md 4 | Seção 2: layout web por largura, popover, teclado, estados na web |
| #38 Detalhe web | picos.md 5 | Seção 3: galeria/lightbox, breakpoints, rota 404, âncora de avaliações |
| #40 Criar web | picos.md 6 | Seção 4: rotas, painel, passo 2 em coluna, saída/guard |
| #44 Editar web, #45 Editar mobile | picos.md 7 | Seção 5: layout por plataforma, fotos, "Alterar local" |
| #47 / #48 Excluir | picos.md 8 | Seção 6: pós-exclusão, foco, mensagens de erro |
| #49 Busca mobile | picos.md 9 | Seção 7: teclado, safe-area, comportamento do mapa |
| #50 Filtros | picos.md 10 | Seção 8: nota mínima agora existe no backend, layout web, estados |
| #56 a #59 Avaliações | picos.md 9A | Seção 10: web (dialog, "Carregar mais", foco) e fluxo mobile consolidado |
| #60 Nota no mapa | picos.md 9A.5 | Seção 11: pin, agrupamento, resumo, acessibilidade |
| #72 Avatar | perfil.md 9 | Seção 12: fluxo completo, onde o avatar aparece, requisitos de backend |

## 2. Home web (#35)

**Objetivo:** ver picos no mapa e abrir o resumo com link para o detalhe, no desktop e no tablet.

**Layout (>= 1024):** header fixo 64 (wordmark, "Novo pico", menu do avatar). Mapa ocupa todo o restante. Canto superior esquerdo, a 24 do header e da borda: busca (420) e abaixo a linha de chips (Filtros, ativos). Controles de zoom/localização no canto inferior direito. `SpotPreview` em popover de 340, ancorado ao pico, com seta; se não couber, inverte o lado (nunca sai da área do mapa).
**640 a 1023:** busca ocupa a largura menos 48; popover de resumo vira cartão fixo na base, centralizado (largura 400), como no mobile.
**< 640:** layout mobile (sem TabBar; header com menu).

**Comportamento:** clique no pin/polígono seleciona e abre o resumo; clique no mapa vazio ou `Esc` fecha. `Tab` percorre: busca, Filtros, chips ativos, "Novo pico", controles do mapa; os picos têm lista equivalente via teclado: com o mapa focado, `]` e `[` selecionam o próximo/anterior pico visível (anuncia "Pico 2 de 7: {nome}") e `Enter` abre o detalhe. Zoom longe = pins; perto = polígonos (UX-P3).

**Estados (web):** loading = chip "Carregando picos..." no topo do mapa; vazio = cartão central-inferior de 400 com a mesma copy da picos.md 4.4 e botão "Cadastrar o primeiro pico" (para visitante sem login: leva ao login e volta); erro = `AlertBanner` 480 no topo do mapa com "Tentar novamente"; sem permissão de localização = toast info; filtros sem resultado = mesmo cartão com "Limpar filtros".

## 3. Detalhe web (#38)

Rota `/spot/:id`. Duas colunas a partir de 1024 (680 + 408, gap 32, conteúdo centralizado, largura máxima 1120). Abaixo de 1024, uma coluna na ordem do mobile; abaixo de 640 a galeria vira carrossel por swipe.
- **Galeria:** foto grande 680x420 (raio `lg`) e faixa de miniaturas 88x64 abaixo (foco e seleção com borda `primary`). Clicar na foto abre **lightbox** em tela cheia (fundo preto 90%, setas, "2 / 4", `Esc` e botão X fecham; foco preso e devolvido à miniatura). `<-` e `->` trocam de foto.
- **Coluna direita:** "Voltar ao mapa" (TextLink com seta; mantém posição e zoom do mapa), título de marca, chips, nota (link "Ver avaliações" rola até `#avaliacoes`), `InfoRow`s, mini-mapa 408x180, autor, botão "Avaliar este pico" (primário, largura total; ausente para o autor), ações do autor ao final.
- **Sem sessão:** visitante vê tudo; "Avaliar este pico" leva ao login e volta ao detalhe.
- **Estados:** loading (skeleton de galeria e blocos), erro de rede (banner + "Tentar novamente"), **Não encontrado**: página inteira com título de marca "Pico não encontrado", texto "Ele pode ter sido excluído ou o link está errado." e botão "Voltar ao mapa".
- `<title>` da aba: "{Nome do pico} - GoPicos".

## 4. Criar pico web (#40)

Rotas: `/spot/new-spot` (passo 1, local) e `/spot/new-spot/details` (passo 2). Quem abrir o passo 2 sem polígono é redirecionado ao passo 1.
- **Passo 1:** mapa em tela cheia sob o header; painel lateral esquerdo de 360 (fundo `surface`, sombra, margem 16): `Stepper` "Passo 1 de 2", título "Marque o local do pico", instrução "Clique no mapa para marcar os cantos. Arraste um ponto para ajustar.", contador de pontos, endereço sugerido, botões na ordem de picos.md 6.1 (Adicionar ponto no centro do mapa, Desfazer, Limpar, Usar minha posição) e **Continuar** no rodapé do painel. `Backspace`/`Ctrl+Z` desfaz. Abaixo de 768 o painel vira sheet inferior fixo.
- **Passo 2:** página própria, coluna única de 560 centralizada, `Stepper` "Passo 2 de 2", título de marca "Detalhes do pico", resumo do local com mini-mapa 560x140 e "Alterar", campos na ordem de picos.md 6.2; **Fotos:** área de arrastar-e-soltar tracejada 560x120 ("Arraste as fotos aqui ou escolha no computador"), miniaturas 3 por linha com X e etiqueta "Capa" na primeira. Botões no fim: "Criar pico" (primário) e "Voltar" (ghost, volta ao passo 1 sem perder dados).
- **Envio/erros/sucesso:** como picos.md 6.3 e 6.4. Erros do servidor aparecem junto ao campo (`field`); sucesso leva ao `/spot/:id` do novo pico com toast "Pico criado!". `Enter` não envia dentro da Descrição.
- **Sair com dados** (voltar do navegador, logo, fechar): confirmação "Descartar este cadastro?".

## 5. Editar pico (#44 web, #45 mobile)

Uma tela, mesmo formulário do passo 2, preenchido (picos.md 7). Detalhes finais:
- **Web** `/spot/:id/edit`: coluna de 560. Cabeçalho "Editar pico" com "Cancelar" à direita; barra de ações **fixa no rodapé do conteúdo** (sticky) com "Cancelar" e "Salvar alterações" para formulários longos.
- **Mobile:** tela empilhada com seta voltar; botão "Salvar alterações" fixo acima do teclado/safe-area quando houver mudança (desabilitado sem mudança não: ver UX-P20, fica ativo).
- **Fotos:** existentes vêm com X; adicionar novas respeitando o total de 5; ao remover a última sem outra: "O pico precisa ter ao menos 1 foto."; foto removida só some de fato ao salvar.
- **Alterar local:** abre o editor de polígono (passo 1) em modo edição com o polígono atual e vértices arrastáveis; "Usar este local" volta ao formulário com o novo resumo. Cancelar volta sem alterar.
- Estados: loading (skeleton do formulário), erro ao carregar (banner + tentar de novo), não encontrado (como 3), não autor (web redireciona ao detalhe com toast; mobile sem entrada).

## 6. Excluir pico (#47 web, #48 mobile)

Conforme picos.md 8. Acréscimos: depois do sucesso o foco vai ao título da Home (web) e o anúncio é "Pico excluído"; o pico some do mapa e do cache sem recarregar. Se o pico já foi excluído por outra via (`NOT_FOUND`), fecha a confirmação, vai à Home e mostra toast info "Este pico já não existe." Web: dialog 420 com `role="alertdialog"`, foco inicial em Cancelar, foco preso, retorno do foco ao botão "Excluir" caso cancele.

## 7. Busca de lugar mobile (#49)

Conforme picos.md 9. Acréscimos de mobile:
- Campo no topo respeita a **safe-area** superior (16 abaixo dela). Ao focar, o campo ganha borda de foco, o mapa escurece (`dim`) e a lista de sugestões ocupa do campo até o teclado (rolável, `keyboardShouldPersistTaps="handled"`).
- O teclado usa `returnKeyType="search"`; "Buscar" escolhe a primeira sugestão. Botão "Cancelar" (TextLink) à direita do campo enquanto focado: limpa o foco e restaura o texto anterior.
- Ao escolher um resultado, o mapa **anima** (voo curto, sem animação com "reduzir movimento") e o campo mostra o nome com X. Sem permissão de localização a busca continua funcionando.
- Sem sugestões ainda (menos de 3 caracteres): lista vazia, sem texto; ao digitar 1 a 2 caracteres, dica `caption` "Digite ao menos 3 letras".
- Estados: carregando ("Buscando..."), sem resultados, erro com "Tentar novamente", offline = erro.

## 8. Filtros (#50, mobile e web)

Conteúdo e microcopy em picos.md 10. Atualizações:
- **Nota mínima** passa a ser possível: o backend já aceita `minRating` no filtro de picos. Mantém `Segmented` Qualquer | 3+ | 4+ | 5.
- **Mobile:** sheet de altura do conteúdo com cabeçalho (título "Filtros", "Limpar filtros" à direita), seções Modalidade (chips multisseleção), Entrada, Cobertura (Switch "Somente cobertos"), Nota mínima, rodapé fixo com "Aplicar filtros" (mostra "Ver {n} picos" quando a contagem é conhecida; opcional, sem contagem fica "Aplicar filtros").
- **Web:** popover de 360 sob o botão (alinhado à esquerda), mesmo conteúdo, rodapé com "Limpar" e "Aplicar"; `Esc` fecha sem aplicar. Abaixo de 640 vira sheet.
- **Chips ativos** ao lado do botão, rolagem horizontal se não couber; remover um chip reaplica na hora. Contagem em "Filtros (n)": cada seção ativa conta 1 (modalidades contam 1 no total).
- **Aplicando:** o botão fica `loading` e o mapa mostra o chip "Carregando picos..."; erro mantém o filtro anterior e mostra toast error "Não foi possível aplicar os filtros." com Tentar novamente.
- Exemplo do critério: "Gratuito" + "Coberto" mostra só picos que atendem aos dois (E lógico entre seções; OU dentro de Modalidade).

## 9. Decisões e justificativas

**UX-F1. Resumo do mapa na web como popover, com fallback para cartão.** Em telas largas, perto do polígono mantém contexto; em telas estreitas um popover cobre o mapa e some fora da tela, então vira cartão fixo.
**UX-F2. Navegação por teclado entre picos (`[` e `]`).** O mapa não é navegável por leitor de tela nem por Tab; precisamos de um equivalente para cumprir acessibilidade sem criar uma lista nova no MVP.
**UX-F3. Lightbox na galeria web.** Fotos de pico são o principal argumento para ir ao local; ampliar sem sair da página é o mínimo esperado em desktop.
**UX-F4. "Voltar ao mapa" preserva posição e zoom.** Quem explora vários picos perde o fio se o mapa reinicia.
**UX-F5. Rotas próprias para cada passo do cadastro web.** Botão voltar do navegador funciona, o passo 2 sem polígono é redirecionado e a página é linkável em testes; o estado do formulário fica no store.
**UX-F6. Capa = primeira foto, com etiqueta "Capa".** Evita um recurso de reordenar (pós-MVP) e deixa claro o que a pessoa ganha ao colocar a melhor foto primeiro.
**UX-F7. Barra de ações fixa na edição.** O formulário é longo; poder salvar sem rolar até o fim reduz abandono.
**UX-F8. Excluir já inexistente vira sucesso silencioso.** O resultado desejado (pico some) já aconteceu; erro vermelho confundiria.
**UX-F9. Busca com "Cancelar" e restauração do texto.** Evita deixar a pessoa presa a um termo digitado pela metade com o mapa escurecido.
**UX-F10. Nota mínima fica no MVP.** O backend já suporta `minRating`; cortar seria perder um critério da issue sem economia.
**UX-F11. Filtros: E entre seções, OU dentro de modalidade.** Corresponde ao critério ("Gratuito" e "Coberto" juntos) e ao modelo mental de marcar vários tipos de pico.
**UX-F12. Pin só com nota, nada de contagem.** O pin é pequeno e lido de longe; a contagem fica no resumo (seção 11).
**UX-F13. Avatar com foto é opcional e nunca bloqueia nada.** Iniciais continuam sendo o padrão; quem não quiser enviar foto não vê diferença.
**UX-F14. Foto de perfil visível só em contexto público mínimo.** Aparece no próprio perfil, no header e nas avaliações; nunca para conta desativada (regra de privacidade do perfil).

## 10. Avaliações (#56 mobile, #57 web, #58 e #59 editar/excluir)

Fluxo e microcopy em picos.md 9A. Resumo por plataforma e acréscimos:
- **Mobile (#56, #58):** botão fixo "Avaliar este pico" abre sheet; sheet sobe com o teclado, o campo de comentário rola para ficar visível; "Enviar avaliação" desabilitado sem estrelas. Minha avaliação no topo da lista com "Editar" (reabre o sheet preenchido, título "Editar sua avaliação", botão "Salvar") e "Excluir" (sheet de confirmação). Lista pagina ao fim da rolagem.
- **Web (#57, #59):** botão "Avaliar este pico" inline na coluna direita; dialog 480 com foco preso, foco inicial na primeira estrela, `Esc` fecha (com confirmação se houver texto). Estrelas por setas. Lista na coluna esquerda com botão **"Carregar mais"** (10 por vez); ao carregar, o foco vai ao primeiro item novo e anuncia "{n} avaliações carregadas". Editar/Excluir como botões ghost no item da pessoa; confirmação em dialog 400.
- **Sem sessão:** "Avaliar este pico" leva ao login e retorna; lista visível para todos.
- **Contagem ao vivo:** após enviar, editar ou excluir, média, contagem e o `SpotPin`/`SpotPreview` na Home refletem a mudança sem recarregar.
- **Erros:** conforme picos.md 9A.2 e 9A.3 (rede preserva texto e nota; já avaliou mostra a existente; excluir com erro mantém a confirmação aberta).

## 11. Nota média nos pins e no resumo (#60)

| Elemento | Com avaliações | Sem avaliações |
|---|---|---|
| `SpotPin` (altura 26, pill) | "★ 4,6" (estrela em `star`, número em `text`) | "Novo" (sem estrela) |
| `SpotPin` selecionado (altura 30) | fundo `primary`, texto `on-primary`, borda escura | idem |
| `SpotPreview` | `StarRating` 16 + "4,6 (23)" | "Sem avaliações" em `caption` |
| `SpotCard` compacto | `StarRating` 14 + "4,6" + "(23)" | "Sem avaliações" |

- Arredondamento a **1 casa decimal**, vírgula (pt-BR); 5,0 mostra "5,0". Contagem acima de 999 vira "999+".
- Estrelas no resumo são preenchidas por arredondamento ao inteiro mais próximo, mas o número exato sempre acompanha (nunca só cor).
- **Pins sobrepostos:** em zoom longe, se dois pins se tocam, o de maior nota fica por cima; o clique seleciona o de cima e, ao fechar, o seguinte pode ser alcançado aproximando o zoom. Não há agrupamento (cluster) no MVP.
- **Acessibilidade:** rótulo do pin "{Nome}, nota 4,6 de 5, 23 avaliações" ou "{Nome}, sem avaliações"; alvo de toque do pin 44x44 mesmo com visual de 26.
- **Dark mode:** `star` do tema escuro (#FBBF24); pin `surface` escuro com borda `border`.
- **Atualização:** o dado vem da listagem enriquecida de picos (nota e contagem); sem requisições por pin.

## 12. Foto de perfil / avatar (#72)

Antes estava especificado como "fora do MVP" (perfil.md 9). A issue está agora em Design, então esta é a spec completa; **implementação só depois da aprovação do dono**.

**Objetivo:** a pessoa troca a foto que aparece no próprio perfil, no header e nas avaliações.

**Onde aparece:** `Avatar` com foto quando houver, iniciais quando não: perfil (xl 96), header web (32), `ReviewItem` (32), "Criado por" no detalhe (24, só com nome público; desativado sem avatar). **Nunca** para conta desativada.

**Entrada:** no perfil, o avatar xl vira botão com selo de câmera 28 no canto inferior direito e rótulo "Alterar foto de perfil". Web também tem "Alterar foto" na tela de editar dados.

**Mobile:** toque abre sheet com **Tirar foto**, **Escolher da galeria**, **Remover foto** (só se houver; `destructive`) e Cancelar. Permissão de câmera/galeria só ao escolher a opção, com texto explicando; se negada, `AlertBanner` info com "Abrir ajustes".
**Web:** dialog 440: área tracejada de arrastar/clicar ("Arraste uma imagem ou escolha no computador"), botão "Escolher imagem"; depois da escolha, prévia circular 160.
**Recorte:** quadrado 1:1 com máscara circular, arrastar para enquadrar e controle de zoom (slider rotulado "Zoom"); botão primário **"Usar esta foto"**, ghost "Trocar imagem". Teclado na web: setas movem, `+`/`-` dão zoom.

**Regras:** JPG, PNG ou WebP, até 5 MB (mesmo limite das fotos de pico); reduzida no cliente a no máximo 512 px antes do envio. Fora do limite: "A imagem precisa ser JPG, PNG ou WebP e ter até 5 MB."

**Estados:**
| Estado | Descrição |
|---|---|
| Sem foto | Iniciais sobre `soft`, selo de câmera |
| Enviando | Anel de progresso no avatar, botão desabilitado, "Enviando foto..." (anunciado) |
| Sucesso | Toast "Foto atualizada."; header e avaliações atualizam sem recarregar |
| Erro | `AlertBanner` "Não foi possível enviar a foto." + "Tentar novamente"; a foto anterior permanece |
| Remover | Confirmação "Remover foto de perfil?" / "Você voltará a ver suas iniciais." (Remover / Cancelar); toast "Foto removida." |
| Imagem não carrega | Cai nas iniciais |
**Acessibilidade:** imagem com `alt=""` (o nome está ao lado), botão com rótulo, alvos 44, progresso anunciado.

**Requisitos para backend/dev (não existe hoje):** campo de URL da foto no usuário, upload via Cloudinary (como nas fotos de pico), mutations para definir e remover, e o campo exposto nas avaliações e no perfil, com `null` para conta desativada. Merece issue de backend própria.

## 13. Protótipos

- **HTML:** `docs/design/prototipos/picos-fechamento.html` (home web e estados, detalhe web com lightbox, criar web passos 1 e 2, editar web e mobile, avaliar web, variações de pin e resumo, filtros web, fluxo de avatar mobile e web). Os protótipos anteriores (`picos.html`, `perfil.html`) continuam valendo para o resto.
- **Figma:** DS em https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN. As contas do dono estão no plano Starter e o MCP já bateu o limite de chamadas na entrega anterior; por isso as telas desta rodada ficaram em HTML estático. Quando houver cota, desenhar a partir do protótipo na página "Telas".

## 14. Ideias pós-MVP
Cluster de pins; lista alternativa de picos próximos; reordenar/escolher capa; busca de pico por nome; ver perfil público de outro usuário a partir do avatar; filtros salvos.

## 15. Pendências para o dono
1. Aprovar o avatar com foto no MVP (#72 era Could): exige issue de backend (upload e campo no usuário).
2. Confirmar o "Carregar mais" (web) e o scroll infinito (mobile) como padrões diferentes.
3. Aprovar que o agrupamento de pins fique fora do MVP (UX-F12/seção 11).
