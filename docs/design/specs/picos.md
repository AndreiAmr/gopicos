# Spec de UX - Picos (mapa, detalhe, criar, editar, excluir, busca, filtros e avaliações)

Issues: #34 (GP-031 home mobile), #35 (GP-032 home web), #37 (GP-034 detalhe mobile), #38 (GP-035 detalhe web), #40 (GP-037 criar web), #41 (GP-038 criar mobile, marcar local), #42 (GP-039 criar mobile, detalhes e fotos), #44 (GP-041 editar web), #45 (GP-042 editar mobile), #47 (GP-044 excluir web), #48 (GP-045 excluir mobile), #49 (GP-046 busca de lugar), #50 (GP-047 filtros). Avaliações (estrelas + comentários): GP-064 a GP-067 (listar, avaliar, editar e excluir minha avaliação, mobile e web) e GP-068 (nota no mapa), na seção 9A.
Base: `docs/design/design-system.md` **v2.0** (já em `main`). Esta spec **não cria cor, fonte, espaço ou raio novos**; só usa tokens do DS.
Decisões numeradas **UX-P1 a UX-P26** (seção 12), para não colidir com UX-1..27 da spec de autenticação.
Protótipo: ver seção 13 (Figma ficou parcial por limite do plano; há protótipo HTML).

Regras de negócio que moldam as telas:
- Polígono do pico em **GeoJSON `[lng, lat]`**, fechado, **mínimo de 3 pontos**.
- **1 a 5 fotos**, **até 5 MB cada**.
- Modalidade é **lista fechada**, escolha única: Street, Park, Bowl/Pool, Vertical, Downhill, Mista.
- Campos do pico: nome, descrição, modalidade, entrada (gratuita ou paga com valor), horário (24 h ou horário informado), cobertura (sim/não), equipamento exigido (sim/não), fotos, polígono.
- **Só o autor edita ou exclui.** Autor com conta desativada aparece como **"Usuário Desativado"**.
- Nota média e contagem de avaliações aparecem no pico (mapa, resumo e detalhe).
- **Avaliação (D2, D3, D5):** nota de 1 a 5 estrelas obrigatória; comentário opcional de até 500 caracteres; uma avaliação por usuário por pico, editável e excluível; o autor do pico **não** avalia o próprio pico; avaliações de conta desativada seguem visíveis como "Usuário Desativado". Lista da mais recente para a mais antiga, paginada.
- Detalhe do pico (contrato do backend, #104): `author {id, name}`, `ratingAverage` (nulo sem avaliações), `reviewsCount`, `isOwner`. A lista de avaliações vem de query própria (GP-063).
- Todo o app exige login; sessão expirada (`UNAUTHENTICATED`) volta ao Login.

---

## 1. Mapa de telas e fluxos

```
Home (mapa) --toque no pico--> Resumo --Ver detalhes--> Detalhe --Editar--> Editar --Salvar--> Detalhe
   |  \--busca de lugar (centraliza o mapa)               \--Excluir--> Confirmação --> Home (toast)
   |  \--Filtros (sheet/popover) --> mapa filtrado        \--Avaliar este pico--> Sheet/dialog de avaliação (seção 9A)
   \--FAB "+" / "Novo pico" --> Criar, passo 1 (marcar local) --> passo 2 (detalhes e fotos) --> Detalhe do novo pico
```

Rotas web (no código, `/` é o **Login**):
| Rota | Tela | Situação |
|---|---|---|
| `/home` | Home com mapa (#35) | existente |
| `/spot/new-spot` | Criar, passo 1 | existente |
| `/spot/new-spot/details` | Criar, passo 2 | existente |
| `/spot/:id` | Detalhe (#38) | **nova, a criar** |
| `/spot/:id/edit` | Editar (#44) | **nova, a criar** |

As rotas estáticas `new-spot` têm precedência sobre `/spot/:id` no React Router. Mobile: telas `SpotDetails`, `SpotEdit`, `SpotCreateMap`, `SpotCreateDetails` na stack, com a Home como aba Mapa.

---

## 2. Componentes do DS usados e o que falta

Existentes no DS v2.0: `Button` (primário, ghost), `Input` (e `Textarea`, mesma regra de campo), `Checkbox`, `Chip` de sticker (seção 13.5 do DS), `StarRating` (leitura 16 e entrada 32), variante `destructive` do `Button`, `BottomSheet`/`Dialog`, `TabBar`, `Toast`, `AlertBanner`, `Stepper`, `TitleBrand`.

**Novos componentes a especificar (nomes iguais em web e mobile):**

| Componente | Descrição |
|---|---|
| `SpotPin` | Marcador no mapa em formato de pílula: `★ 4,6` (nota média). Sem avaliações: `Novo`. Altura 26, fundo `surface`, borda `border` 1,5, raio `full`, sombra `elevation.1`. **Selecionado:** fundo `primary`, texto `on-primary`, borda `ink`, altura 30. Alvo de toque 44 (área invisível maior que o desenho). Rótulo de acessibilidade: "{nome}, nota {média}, {n} avaliações". |
| `SpotPolygon` | Camada do polígono: preenchimento `primary` a 22% (38% selecionado), contorno `primary` 2 px (selecionado 3 px em `primary-text`). Nunca só cor: o selecionado também ganha o pin maior. |
| `SpotCard` | **Card de pico, variante compacta de lista** (consumida também por "Meus picos" na spec de perfil). Linha de altura mínima 96, padding `space.3`, fundo `surface`, raio `lg`, borda `divider`. Esquerda: foto 72x72 (raio `md`; sem foto ou falha: tile `sunken` com ícone). Direita: nome (`h3`, até 2 linhas), chip de modalidade (sticker amarelo, 28), `StarRating` 16 com "4,6 (23)" ou "Sem avaliações". **Não traz endereço** (não existe em nenhum contrato), nem botões, nem ações de editar/excluir. O **card inteiro é o alvo** (>= 96 de altura, toque abre o detalhe), com estados pressed e focus. Rótulo: "{nome}, {modalidade}, nota {média}, {n} avaliações". **Skeleton:** foto e 3 barras em `sunken`. Estados: padrão, pressed, focus, loading. |
| `SpotPreview` | Resumo do mapa: o **`SpotCard` compacto reaproveitado**, acrescido de distância em `caption` (quando há localização) e do botão "Ver detalhes"; fundo `surface`, `elevation.2`. Fundo `surface`, raio `lg`, `elevation.2`. |
| `FilterChip` | Chip do DS (sticker) selecionável: desmarcado `surface` + `border`; marcado amarelo `brand-yellow` + `sticker-border` + `sticker-shadow`. Alvo mínimo 44 (altura visual 36). |
| `PhotoPicker` | Grade de 3 colunas, miniaturas 100 de altura, raio `md`; tile "+ Adicionar" tracejado; botão remover (X) 28 com alvo 44; primeira foto marcada "Capa"; contador "2 de 5 fotos". |
| `InfoRow` | Linha rótulo (`text-muted`, 14) + valor (`body-strong`, 14), altura 44, divisor `divider`. |
| `Segmented` | 2 a 4 opções exclusivas, altura 44, borda `border`, selecionado `primary`/`on-primary`. Usado em Entrada e Nota mínima. |
| `Switch` | 48x28, ligado `primary`. Usado em "Aberto 24 horas" e "Somente cobertos". |
| `MapControls` | Camada sobre o mapa: busca, chips de filtro, FAB, botão de localização, seletor de camadas (#51, existente). |
| `StarInput` | Entrada de nota: 5 estrelas de 32 (DS; alvo 48 com espaço), cor `star`, vazias em contorno `border`; grupo de rádio; rótulo textual da nota. |
| `ReviewItem` | Item de avaliação: avatar de iniciais 32, nome, data relativa, `StarRating` 16, comentário com "Ver mais". Variante "minha avaliação" com selo e ações. |
| (sem componente novo) | Ações destrutivas usam o `Button` variante **`destructive`** do DS (fundo `error`). Texto do botão: `surface` no claro (branco sobre `#B3201F`, 6,68:1) e `bg` `#0F1113` no escuro (sobre `#FF8A80`, acima de 8,39:1). **Um único valor no escuro**, o mesmo da spec de perfil; não se cria token `on-error`. |

Pendência de DS (a incluir na seção 8 do DS quando o dono aprovar): `SpotPin`, `SpotPolygon`, `SpotCard`, `SpotPreview`, `PhotoPicker`, `Segmented`, `Switch`, `StarInput`, `ReviewItem`. Sem token novo: o texto da variante `destructive` usa `surface` (claro) e `bg` (escuro), tokens que já existem.

---

## 3. Padrões comuns

### 3.1 Estados de dados (valem para todas as telas)
| Estado | Mapa/lista | Detalhe | Formulários |
|---|---|---|---|
| Loading | Mapa aparece de imediato (tiles); chip discreto "Carregando picos..." no topo; nunca bloquear o mapa com spinner de tela cheia | Skeleton: faixa da galeria + 3 blocos (`sunken`, raio `md`), sem animação de pulso se "reduzir movimento" | Botão em `loading` (largura mantida), campos somente leitura, anúncio "Salvando" |
| Vazio | Sheet "Nenhum pico por aqui ainda" + CTA | (não se aplica) | (não se aplica) |
| Erro de rede/servidor | `AlertBanner` no topo do mapa: "Não foi possível carregar os picos. Verifique sua conexão." + "Tentar novamente" (mantém o último resultado, se houver) | Tela de erro com "Tentar novamente" | `AlertBanner` acima do botão, **dados preservados** |
| Não encontrado | (não se aplica) | "Pico não encontrado" + "Voltar ao mapa" | (editar: mesma tela) |
| Sessão expirada | Vai ao Login com `AlertBanner` info "Sua sessão expirou. Entre novamente." | idem | idem; rascunho do formulário não é guardado (decisão D24) |

### 3.2 Acessibilidade comum
- Alvos de toque >= 44 (mínimo do DS; 48 é o padrão dos botões e campos); o visual pode ser menor (36) com área invisível. Tudo com rótulo; foco visível `focus`.
- O mapa não é navegável por leitor de tela: toda ação do mapa tem equivalente fora dele (ver UX-P17). A informação dos picos também chega por busca e resumo.
- Cor nunca é a única pista: polígono selecionado = contorno mais grosso + pin maior; filtro ativo = texto "(2)" no botão + chips com marcador de seleção.
- Respeitar "reduzir movimento": a animação de centralizar o mapa vira salto.
- Fonte a 130%: nada trunca; chips quebram linha.

### 3.3 Nome do autor em contexto público (D36, aprovada pelo dono)
Em todo contexto público o nome aparece como **"Nome S."** (primeiro nome + inicial do sobrenome): "Criado por Marina S." no detalhe e o nome em cada `ReviewItem`. Nome completo só no próprio perfil. Nome sem sobrenome: só o nome. Conta desativada: "Usuário Desativado". Iniciais do avatar: primeira letra do nome.
**Impacto técnico:** `author.name` do #104 hoje devolve o nome completo. Para não entregar o sobrenome ao cliente, o ideal é o backend devolver o nome já formatado (ex.: `author.displayName`) nos contratos de detalhe e de listagem de avaliações; isso depende da separação nome/sobrenome do cadastro (#97) e vira issue de backend. Enquanto isso, o cliente formata a partir de `name` (último termo vira inicial), com função única compartilhada. Limites de texto coerentes com o perfil (D37: nome e sobrenome 40 cada; aqui comentário 500, nome do pico 80, descrição 1000).

---

## 4. Tela - Home com mapa (#34 mobile, #35 web)

**Objetivo:** descobrir picos por perto e abrir o resumo em um toque.

### 4.1 Hierarquia (mobile)
1. Mapa em tela cheia, polígonos e `SpotPin`s, posição do usuário (se permitida).
2. Topo flutuante: campo de busca (48 de altura) e, abaixo, linha de chips: **Filtros**, mais os filtros ativos (com X).
3. Botão de localização e seletor de camadas na lateral direita (já existentes).
4. **FAB "+"** (56) acima da TabBar, no canto inferior direito: criar pico.
5. `SpotPreview` ancorado acima da TabBar quando um pico é tocado.
6. TabBar: **Mapa** e **Perfil** (Perfil chega em #66).

### 4.2 Hierarquia (web)
Header fixo 64: wordmark, botão **Novo pico** (primário, 40 de altura) e avatar (menu com Perfil/Sair, spec de perfil). Mapa preenchendo o restante. Busca (420 de largura) e chips no canto superior esquerdo do mapa. `SpotPreview` aparece como popover perto do polígono (340 de largura, sem sair da área visível); clicar fora ou `Esc` fecha.

### 4.3 Comportamento
- **Tocar num pin ou polígono** seleciona o pico (realce) e abre `SpotPreview`; tocar em outro troca; tocar no mapa vazio fecha. "Ver detalhes" abre o detalhe. Não abre o detalhe direto: o resumo evita perder o contexto do mapa (UX-P1).
- **Zoom:** em zoom longe, só pins; em zoom perto (a partir de ~15, ajuste fino com o Dev), polígonos. Evita poluição e mantém desempenho (UX-P3).
- **Localização:** se negada, o mapa abre na última região vista ou numa região padrão, sem bloquear; botão de localização pede permissão de novo com texto explicativo. Não mostra "distância" no resumo sem localização.
- **Camadas** (#51): fora desta spec, mantém o existente.

### 4.4 Estados
| Estado | Descrição |
|---|---|
| Padrão | Pins e polígonos da área; nada selecionado |
| Selecionado | Resumo aberto, pin e polígono realçados |
| Loading | Chip "Carregando picos..." |
| **Vazio** | Sheet na base: título "Nenhum pico por aqui ainda", texto "Seja o primeiro a cadastrar um pico nesta região.", botão "Cadastrar o primeiro pico" (leva ao passo 1) |
| Vazio por filtro | Mesmo sheet com "Nenhum pico com esses filtros." e botão "Limpar filtros" |
| **Erro** | `AlertBanner` error no topo + "Tentar novamente" |
| Sem permissão de localização | Sem círculo de posição; toast info "Ative a localização para ver picos perto de você." ao tocar no botão de localização |

### 4.5 Microcopy
Busca: "Buscar cidade ou endereço". Chips: "Filtros", "Filtros (2)". Resumo: "A 1,2 km de você", "Ver detalhes". Pin sem nota: "Novo". FAB (rótulo de acessibilidade): "Cadastrar novo pico".

---

## 5. Tela - Detalhe do pico (#37 mobile, #38 web)

**Objetivo:** dar toda a informação para decidir ir ao pico e permitir avaliar.

### 5.1 Hierarquia (mobile, de cima para baixo)
1. **Galeria** (altura 260, largura total): swipe horizontal, contador "1 / 4", botão voltar circular sobre a foto (44, `surface`, sombra).
2. **Título** (`TitleBrand`, Permanent Marker 28) com traço de spray.
3. Chips: modalidade (sticker amarelo), "Gratuito" ou o valor ("R$ 20"), "Coberto" (se for).
4. Nota: `StarRating` 16 + "4,6" + "23 avaliações" (sem avaliações: "Sem avaliações ainda").
5. Descrição (`body`).
6. `InfoRow`s: Entrada, Horário, Cobertura, Equipamento.
7. **Mini-mapa** do polígono (altura 160, raio `lg`); toque abre o mapa na Home centralizado no pico.
8. "Criado por {Nome S.}" em `caption` (formato do autor, ver 3.3); autor desativado: **"Criado por Usuário Desativado"**, sem link nem avatar.
9. **Ações do autor** (só se `isOwner`): "Editar" (ghost) e "Excluir" (ghost em `error`), lado a lado.
10. **Seção "Avaliações"** (9A): resumo (média grande, distribuição não incluída no MVP), minha avaliação, lista.
11. **Barra fixa inferior:** botão primário "Avaliar este pico" (abre o formulário de avaliação, seção 9A; quando já avaliei, vira "Ver minha avaliação" e rola até a minha; para o autor do pico o botão **não existe**).

### 5.2 Hierarquia (web)
Duas colunas (a partir de 1024): esquerda 680 com galeria grande e miniaturas (clicáveis, `Esc` fecha o zoom), descrição; direita 408 com "Voltar ao mapa", título, chips, nota, `InfoRow`s, mini-mapa, autor, "Avaliar este pico" e ações do autor. Abaixo de 1024: uma coluna, na ordem do mobile, sem barra fixa (o botão fica após as informações).

### 5.3 Estados
| Estado | Descrição |
|---|---|
| Loading | Skeleton da galeria e dos blocos |
| Não autor | Sem "Editar" e "Excluir" (não desativados: **ausentes**) |
| Foto com falha | Tile `sunken` com "Não foi possível carregar a foto" e ação tocar para recarregar |
| **Não encontrado** (`NOT_FOUND`) | "Pico não encontrado", texto "Ele pode ter sido excluído ou o link está errado.", botão "Voltar ao mapa"; web: página inteira em `/spot/:id` |
| Erro de rede | Tela com `AlertBanner` + "Tentar novamente" |
| Autor desativado | "Usuário Desativado" (UX-P12) |

### 5.3a Microcopy
"Entrada: Gratuita / R$ 20"; "Horário: Aberto 24 horas / {horário}"; "Cobertura: Coberto / Descoberto"; "Equipamento: Exige proteção / Não exige"; "{n} avaliações" / "1 avaliação"; "Avaliar este pico"; "Editar"; "Excluir".

---

## 6. Fluxo - Criar pico (#41 mobile passo 1, #42 mobile passo 2, #40 web)

Dois passos (UX-P4): (1) marcar o local, (2) detalhes e fotos.

### 6.1 Passo 1 - Marcar o local
**Mobile (#41):** mapa em tela cheia com cabeçalho "Passo 1 de 2 - Marque o local" (e seta voltar). Painel inferior (sheet fixo): endereço sugerido (geocoding reverso do centro/primeiro ponto, `caption`), instrução, contador "{n} pontos", botões **Desfazer**, **Limpar**, **Usar minha posição** (ghost) e **Continuar** (primário).
- **Toque no mapa** adiciona um vértice (círculo 18 com borda `primary-text`); **arrastar** o vértice o move; o polígono fecha sozinho (a figura fica fechada a partir de 3 pontos).
- **Continuar** só habilita com **>= 3 pontos** (critério). Com menos, o botão fica `disabled` e o contador diz "Marque pelo menos 3 pontos".
- **Adicionar ponto no centro do mapa** (botão ghost no painel, mobile e web; rótulo de acessibilidade "Adicionar ponto no centro do mapa"): cria um vértice sob a mira central do mapa (cruz de 24 desenhada no centro durante este passo). Permite marcar o polígono sem tocar com precisão e sem enxergar o mapa: o mapa em si não é navegável por leitor de tela, então o fluxo todo (mover o mapa por gestos/botões de zoom e adicionar pontos) tem equivalente fora do toque direto. Anuncia "Ponto {n} adicionado". Web: tecla `Enter` com o mapa focado faz o mesmo.
- **Usar minha posição:** centraliza o mapa e adiciona um vértice na posição atual; se sem permissão, toast info com orientação.
- Sair com pontos marcados: confirma "Descartar o local marcado?" (Descartar / Continuar editando).
Painel mobile, ordem dos botões: **Adicionar ponto no centro do mapa**, Desfazer, Limpar, Usar minha posição, Continuar.
**Web (#40):** mesma lógica em tela com mapa e painel lateral esquerdo de 360 (instrução, contador, botões, endereço). Clique adiciona vértice; arrastar move; `Backspace`/`Ctrl+Z` desfaz o último.

### 6.2 Passo 2 - Detalhes e fotos
Ordem de cima para baixo:
1. `Stepper` "Passo 2 de 2" + título "Detalhes do pico".
2. Resumo do local: mini-mapa + "Local marcado, {n} pontos" + link "Alterar" (volta ao passo 1 sem perder os dados).
3. **Fotos** (`PhotoPicker`): rótulo "Fotos (1 a 5, até 5 MB cada)". Mobile: "Adicionar" abre sheet "Tirar foto" / "Escolher da galeria". Web: seletor de arquivos e arrastar-e-soltar.
4. Campos: Nome, Descrição, **Modalidade** (6 chips, escolha única, obrigatório).
5. **Entrada:** `Segmented` Gratuito | Pago; Pago revela campo "Valor" (texto livre: "R$ 20").
6. **Horário:** `Switch` "Aberto 24 horas"; desligado revela campo "Horário de funcionamento" (texto livre: "Seg a sex, 8h às 22h").
7. Checkboxes: "Coberto" e "Exige equipamento de proteção".
8. Botão primário **"Criar pico"** no fim do formulário (mobile: no fim da rolagem; web: no fim da coluna de 560).

### 6.3 Validação e erros
| Campo | Regra | Mensagem |
|---|---|---|
| Fotos | 1 a 5 | Nenhuma: "Adicione ao menos 1 foto."; ao passar de 5: "Você pode enviar no máximo 5 fotos." |
| Foto > 5 MB | recusa só aquela foto | "A foto {nome} passa de 5 MB e não foi adicionada." |
| Nome | obrigatório; limite sugerido 80 | "Informe o nome do pico." |
| Descrição | obrigatória; limite sugerido 1000 | "Descreva o pico." |
| Modalidade | obrigatória | "Escolha a modalidade." |
| Valor | obrigatório se Pago | "Informe o valor da entrada." |
| Horário | obrigatório se não for 24 h | "Informe o horário de funcionamento." |
| Local | >= 3 pontos | tratado no passo 1 |
Validação no blur e ao tocar "Criar pico"; ao falhar, rola e foca o primeiro campo inválido e anuncia "Corrija os campos destacados". **Erro do servidor** (`VALIDATION_ERROR`) aparece no campo do `field`; a mensagem do servidor vale (mesma regra da autenticação); sem `field`: `AlertBanner` acima do botão.

### 6.4 Envio
- **Enviando:** botão `loading`, campos somente leitura, fotos com progresso (barra de 4 de altura em cada miniatura; não obrigatório se o envio for em uma chamada, nesse caso um só indicador).
- **Sucesso:** vai ao **detalhe do novo pico** (`replace`), toast success "Pico criado!".
- **Falha de rede:** `AlertBanner` "Não foi possível criar o pico. Seus dados foram mantidos." + "Tentar novamente"; **nada é limpo** (critério).
- **Sair do passo 2 com dados:** confirma "Descartar este cadastro?" (Descartar / Continuar editando).
- **Teclado (mobile):** `KeyboardAvoidingView`; `returnKeyType="next"` nos campos de uma linha, "Concluído" no último; a Descrição usa quebra de linha; o formulário rola até o campo focado.

---

## 7. Fluxo - Editar pico (#44 web, #45 mobile)

- Só o autor vê "Editar". Web: não autor em `/spot/:id/edit` é **redirecionado ao detalhe** com toast info "Só quem criou o pico pode editá-lo." (critério). Mobile: a ação não existe para não autores.
- **Uma única tela** (não repete o wizard): mesmo formulário do passo 2, preenchido, com o resumo do local ("Local marcado, {n} pontos" + "Alterar local", que abre o editor de polígono do passo 1 com o polígono atual). Título "Editar pico"; botão **"Salvar alterações"**; link/ação secundária "Cancelar".
- **Fotos:** mostrar as existentes; remover e adicionar respeitando 1 a 5 (não deixa remover a última sem adicionar outra: erro "O pico precisa ter ao menos 1 foto.").
- **Sem mudanças:** "Salvar alterações" fica ativo, mas ao salvar sem diferença só volta ao detalhe (sem erro).
- **Sucesso:** volta ao detalhe atualizado, toast "Alterações salvas." O detalhe **e o mapa refletem a mudança sem recarregar**: pin, polígono e resumo na Home também atualizam (cache invalidado/atualizado).
- **Sair com alterações:** "Descartar alterações?" (Descartar / Continuar editando).
- Estados de loading (carregar o pico), erro e não encontrado como em 3.1; falha ao salvar preserva as edições.

---

## 8. Fluxo - Excluir pico (#47 web, #48 mobile)

- Ponto de entrada: "Excluir" no detalhe (só autor).
- **Confirmação** (mobile: bottom sheet; web: dialog 420 centralizado):
  - Título: **"Excluir este pico?"**
  - Texto: **"Esta ação não pode ser desfeita. O pico, as fotos e as avaliações dele serão removidos."**
  - Botões: **"Excluir pico"** (`Button` `destructive`) e **"Cancelar"** (ghost). Mobile: destrutivo em cima, cancelar embaixo, tamanho total. Web: Cancelar à esquerda, Excluir à direita.
  - **Foco inicial em "Cancelar"**; `Esc` e toque fora cancelam; sem exigir digitar o nome (UX-P11).
- **Excluindo:** botão `loading`, ambos desabilitados.
- **Sucesso:** o pico some do mapa; volta à Home com toast "Pico excluído."
- **Erro:** `AlertBanner` dentro da confirmação "Não foi possível excluir. Tente novamente." (a confirmação continua aberta).
- **Não autor:** a ação não existe; se o servidor negar (`FORBIDDEN`), toast error "Só quem criou o pico pode excluí-lo."

---

## 9. Busca de lugar (#49)

Escopo (issue): geocoding de **cidade ou endereço** para centralizar o mapa. **Não** busca picos por nome (decisão D20).
- Campo no topo do mapa (placeholder "Buscar cidade ou endereço"). Ao focar, o mapa escurece e a lista aparece abaixo do campo; tecla "Buscar"/Enter dispensa o teclado.
- Sugestões a partir de **3 caracteres**, com atraso (debounce) de ~300 ms, **no máximo 5**. Cada item: ícone de local, nome principal em `body-strong`, contexto ("São Paulo, SP") em `caption`; altura mínima 56.
- Escolher: fecha a lista, **centraliza o mapa** (zoom adequado ao tipo do resultado) e mantém o texto no campo com um "X" para limpar.
- **Sem resultados:** "Nenhum lugar encontrado. Tente outro nome ou endereço." (estado vazio, critério).
- **Carregando:** linha "Buscando..." na lista. **Erro:** "Não foi possível buscar agora." + "Tentar novamente".
- Web: lista como popover sob o campo, navegável por setas, Enter escolhe, `Esc` fecha (padrão combobox, `role="combobox"` + `listbox`).

---

## 9A. Avaliações no detalhe (GP-064 a GP-067, GP-068)

**Objetivo:** ver o que a comunidade acha do pico e deixar a própria nota em poucos toques.

### 9A.1 Seção "Avaliações" (abaixo das ações do autor)
1. Cabeçalho `h2` "Avaliações" com média grande ("4,6", `h1` sem fonte de marca), `StarRating` 20 e "23 avaliações". Sem avaliações: só o estado vazio abaixo.
2. **Minha avaliação** (se existir), fixada no topo da lista, com selo "Sua avaliação" e ações **Editar** e **Excluir** (ghost, alvo 44).
3. **Lista** da mais recente para a mais antiga. Cada item (`ReviewItem`, componente novo): avatar com iniciais (32), nome (`body-strong`) ou "Usuário Desativado", data relativa em `caption` ("há 2 dias"; data completa no rótulo de acessibilidade), `StarRating` 16, comentário (`body`, até 4 linhas com "Ver mais" que expande). Sem comentário: só a nota. Divisor `divider` entre itens.
4. **Paginação:** 10 por página. Mobile: carrega a próxima ao chegar ao fim da seção, com linha "Carregando mais..." e, em falha, "Não foi possível carregar mais. Tentar novamente". Web: botão **"Carregar mais"** (critério GP-065), foco volta ao primeiro item novo.

### 9A.2 Formulário de avaliação (nova e edição)
- **Mobile:** bottom sheet (altura do conteúdo; sobe com o teclado). **Web:** dialog 480 centralizado (`<640` vira sheet). Título "Avaliar este pico" (edição: "Editar sua avaliação").
- Conteúdo: `StarInput` (componente novo): 5 estrelas de 32 com alvo 48, toque seleciona; rótulo textual abaixo muda com a nota ("Ruim", "Regular", "Bom", "Muito bom", "Excelente"). Campo "Comentário (opcional)" `Textarea` de 96 de altura, contador "0/500" em `caption` (vira `error` ao passar). Botão primário **"Enviar avaliação"** (edição: "Salvar") e ghost "Cancelar".
- **Enviar fica desabilitado sem estrelas** (critério); a dica "Escolha de 1 a 5 estrelas" aparece sob as estrelas desde o início, não só como erro.
- **Acessível:** `StarInput` é um grupo de rádio ("Nota", 5 opções, "3 de 5 estrelas"); no teclado, setas mudam a nota. Mobile: cada estrela é botão com rótulo "{n} estrelas".
- **Enviando:** botão `loading`, campos somente leitura. **Sucesso:** fecha, minha avaliação aparece no topo da lista, a média e a contagem atualizam na hora, toast success "Avaliação enviada!" (edição: "Avaliação atualizada."). **Erro de rede:** `AlertBanner` dentro do formulário, "Não foi possível enviar sua avaliação. Tente novamente.", nota e texto preservados. `REVIEW_ALREADY_EXISTS` (código **a confirmar com o contrato de GP-061**; hoje não existe em `main`): fecha o formulário, mostra minha avaliação existente e toast info "Você já avaliou este pico. Edite sua avaliação." `VALIDATION_ERROR`: mensagem do servidor junto ao campo. Sessão expirada: como 3.1.
- **Sair com texto digitado:** descartar sem confirmação se estiver vazio; se tiver comentário ou nota, confirma "Descartar sua avaliação?".

### 9A.3 Excluir minha avaliação
Confirmação curta (sheet/dialog menor): "Excluir sua avaliação?" / "Sua nota e seu comentário serão removidos. Você poderá avaliar de novo depois." / **"Excluir avaliação"** (`Button` `destructive`) e "Cancelar" (foco inicial em Cancelar). Sucesso: some da lista, média atualizada, o botão "Avaliar este pico" volta, toast "Avaliação excluída." Erro: banner na confirmação.

### 9A.4 Estados da seção
| Estado | Descrição |
|---|---|
| Loading | 3 itens skeleton (avatar, duas linhas) |
| **Vazio** | Ícone de estrela, "Seja o primeiro a avaliar" e texto "Conte como é andar neste pico."; o CTA é o botão "Avaliar este pico" já presente (para o autor do pico, só o texto "Ainda sem avaliações.") |
| Erro ao carregar | `AlertBanner` na seção "Não foi possível carregar as avaliações." + "Tentar novamente"; o resto do detalhe continua utilizável (UX-P15) |
| Autor do pico | Sem botão de avaliar e sem formulário; vê a lista; aviso discreto `caption` "Você criou este pico, por isso não pode avaliá-lo." |
| Usuário desativado | Item com iniciais "?" neutras e nome "Usuário Desativado" |
| Sem comentário | Item só com nota |

### 9A.5 Nota no mapa (GP-068)
`SpotPin` mostra "★ 4,6" ou "Novo"; `SpotPreview` mostra `StarRating` + "4,6 (23)" ou "Sem avaliações". Rótulo de acessibilidade dos dois traz nota e contagem por extenso.

### 9A.6 Web
Em >= 1024 a seção ocupa a coluna esquerda (680) abaixo da descrição, e o resumo da média também aparece no bloco da direita (nota + contagem, link "Ver avaliações" que rola até a seção). O dialog de avaliação é navegável por teclado com foco preso e `Esc` fecha.

---

## 10. Filtros (#50)

Filtros pedidos: **modalidade**, **pago/gratuito**, **coberto**, **nota mínima**.
- **Mobile:** botão "Filtros" abre bottom sheet com: Modalidade (chips, **multisseleção**), Entrada (`Segmented` Todos | Gratuito | Pago), "Somente cobertos" (`Switch`), Nota mínima (`Segmented` Qualquer | 3+ | 4+ | 5). Rodapé: **"Aplicar filtros"** (primário) e "Limpar filtros" (`TextLink` no cabeçalho do sheet).
- **Web:** mesmo conteúdo num popover de 360 sob o botão; abaixo de 640 vira sheet.
- **Ativos:** o botão passa a "Filtros (n)" e cada filtro ativo aparece como chip removível ao lado ("Street x"). "Limpar filtros" disponível no sheet e quando o resultado fica vazio.
- **Resultado vazio:** ver 4.4 ("Nenhum pico com esses filtros.").
- Filtros **persistem na sessão** (não entre aberturas do app), ver UX-P14.
- **Atenção técnica:** o backend (GP-030) filtra por modalidade, pago e coberto; **nota mínima não está no backend** (decisão D21).

---

## 11. Diferenças entre mobile e web

| Tema | Mobile | Web |
|---|---|---|
| Resumo do pico | Cartão ancorado acima da TabBar | Popover perto do polígono |
| Criar | Passo 1 em tela cheia de mapa com sheet; passo 2 em tela rolável | Painel lateral de 360 sobre o mapa; passo 2 em coluna de 560 |
| Detalhe | Uma coluna, galeria no topo, barra fixa "Avaliar este pico" | Duas colunas >= 1024; botão inline |
| Confirmar exclusão | Bottom sheet | Dialog centralizado (`<640` vira sheet) |
| Filtros e busca | Sheet e lista cheia | Popover/combobox, teclado completo |
| Fotos | Câmera ou galeria | Seletor de arquivo e arrastar-e-soltar |
| Teclado | `KeyboardAvoidingView`, safe-area em cima e embaixo | Enter envia o formulário, `Esc` fecha camadas, foco gerenciado |
| Mapa escuro | Estilo escuro do Mapbox no tema escuro | idem |

---

## 12. Decisões e justificativas

**UX-P1. Resumo antes do detalhe.** Tocar no pico mostra um cartão em vez de abrir a tela de detalhe. Quem anda de skate explora vários picos seguidos; o resumo evita ir e voltar e mantém o mapa no lugar. É também o critério da issue.

**UX-P2. Ações principais na metade de baixo.** FAB, "Ver detalhes", "Continuar" e "Avaliar este pico" ficam onde o polegar alcança (uso com uma mão na rua). Busca e filtros ficam no alto porque são consultas, não ações frequentes de um toque.

**UX-P3. Pins longe, polígonos perto.** Muitos polígonos em zoom aberto viram ruído e pesam; pins com nota entregam a informação mais útil (a nota) de longe.

**UX-P4. Criar em 2 passos.** Mapa e formulário disputam espaço e teclado; separar evita um mapa espremido atrás do teclado e deixa cada passo curto. A issue já divide em #41 e #42.

**UX-P5. Polígono por toque e arrasto, com desfazer.** Marcar cantos é como o skatista pensa o pico; arrastar permite ajuste fino sem apagar tudo; Desfazer e Limpar cobrem erros do dedo grosso. Continuar só com 3 pontos (critério).

**UX-P6. Modalidade como chips de sticker, escolha única.** A lista é fechada e curta (6): chips mostram todas as opções sem abrir menu e carregam a identidade de rua do DS. Escolha única porque o modelo tem uma modalidade por pico.

**UX-P7. Entrada e horário com revelação condicional.** O backend exige valor se pago e horário se não for 24 h; revelar só quando necessário mantém o formulário curto no caso mais comum (gratuito, 24 h).

**UX-P8. Fotos: capa na primeira, remoção visível, limites no rótulo.** O limite (1 a 5, 5 MB) vem escrito antes do erro, não só depois. Recusar só a foto grande (não o formulário todo) preserva o trabalho.

**UX-P9. Falha de rede preserva tudo.** Cadastrar em campo, com sinal ruim, é o caso real; perder 4 fotos e o texto faria a pessoa desistir. É o critério da issue.

**UX-P10. Editar numa tela só.** Quem edita quer corrigir um campo, não refazer um wizard. O polígono é editável por "Alterar local", mas não é a primeira coisa na tela.

**UX-P11. Exclusão com confirmação simples e foco em Cancelar.** Pede confirmação clara e consequência explícita (fotos e avaliações somem), mas sem digitar o nome do pico: o custo de erro é médio e digitar no celular é caro. O foco em "Cancelar" reduz toque acidental.

**UX-P12. "Usuário Desativado" sem link.** Regra do PO (D4). Sem avatar e sem link evita sugerir que há perfil a visitar.

**UX-P13. Busca é de lugar, não de pico.** Segue a issue (geocoding). Buscar picos por nome é útil, mas é outra funcionalidade; vai como pergunta e pós-MVP.

**UX-P14. Filtros em sheet com "Aplicar", chips ativos visíveis.** Aplicar em lote evita recarregar o mapa a cada toque; os chips ativos deixam claro por que "sumiram" picos (causa mais comum de confusão em filtros). "Limpar filtros" aparece onde a pessoa se perde: no sheet e no vazio.

**UX-P15. Estados sem bloquear o mapa.** Loading é um chip, erro é um banner: o mapa continua usável com o último resultado.

**UX-P16. Nota com vírgula e "Novo" sem avaliações.** Formato pt-BR ("4,6"). "Novo" no pin sinaliza que falta avaliar e incentiva a primeira nota, sem mostrar 0,0 que pareceria nota baixa.

**UX-P17. Alternativas ao toque preciso e ao mapa.** Botão "Usar minha posição", "Adicionar ponto no centro do mapa" (acessível a leitor de tela e a quem não acerta o toque) e teclado na web. O mapa em si não é acessível; as ações têm equivalente fora dele.

**UX-P18. Ações do autor longe do CTA.** "Editar" e "Excluir" ficam no fim do conteúdo, separadas da barra fixa "Avaliar este pico", para evitar toque acidental de uma ação destrutiva.

**UX-P19. Marca contida.** Permanent Marker e spray só no título; o resto (campos, listas, cartões) é Inter limpo, para o formulário seguir legível e rápido.

**UX-P20. Sem mudanças = sem erro.** Salvar sem alterar só volta ao detalhe; evita um erro que o usuário não entenderia.

**UX-P21. Nota obrigatória visível antes do erro.** A dica "Escolha de 1 a 5 estrelas" e o botão desabilitado deixam claro o mínimo para enviar, sem punir com mensagem vermelha logo na abertura. O comentário é opcional (D3), então não ganha asterisco nem erro.

**UX-P22. Formulário em sheet/dialog, não em tela.** Avaliar é uma ação curta (um toque e, às vezes, uma frase); manter o detalhe ao fundo preserva o contexto e reduz o custo de desistir.

**UX-P23. Minha avaliação fixada no topo.** Confirma ao usuário o que ele enviou, dá acesso a Editar/Excluir sem procurar e reforça a regra de uma avaliação por pico (o CTA vira "Ver minha avaliação").

**UX-P24. Atualização imediata da média ao enviar.** O retorno visível (nota e contagem mudam, toast) é a recompensa da ação; reduz a dúvida "foi enviado?" com sinal ruim. Se a rede falhar, nada é perdido.

**UX-P25. Autor do pico não vê o botão de avaliar (D5).** Esconder com uma frase explicativa é mais claro do que um botão desabilitado ou um erro depois do envio.

**UX-P26. Rótulo textual da nota e data relativa.** Estrelas sozinhas são ambíguas para leitor de tela e daltonismo leve; o texto ("Muito bom") e "há 2 dias" dão contexto e são lidos por completo no rótulo de acessibilidade.


---

## 13. Protótipos

- **Figma (DS):** https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN. Os frames de Picos **não foram desenhados no Figma**: o plano gratuito atingiu o limite de chamadas do MCP durante a criação. Quando o limite renovar ou o plano mudar, desenhar a partir do protótipo abaixo na página **Telas** (seção "Picos").
- **Protótipo HTML estático:** `docs/design/prototipos/picos.html` (abrir no navegador). Cobre: Home (mobile claro e escuro, web claro), Detalhe (idem), SpotCard compacto, Avaliações (lista com minha avaliação, formulário claro e escuro, vazio), Criar passo 1 e 2 (claro, escuro com erro de campo), Filtros (mobile claro e escuro, web), Busca (sugestões e vazio), Excluir (mobile claro e escuro, web) e os estados vazio, erro, carregando e não encontrado. Mapa e fotos são ilustrações.

---

## 14. Ideias pós-MVP

- Buscar picos por nome ou por modalidade na busca.
- Lista alternativa de picos próximos (também ajuda leitor de tela).
- "Como chegar" (abrir app de rotas), compartilhar pico, favoritos.
- Reordenar fotos e escolher a capa; recorte de foto.
- Detectar polígono com linhas cruzadas e avisar.
- Rascunho salvo do cadastro entre sessões.
- Denunciar pico/foto.

---

## 15. Decisões D18-D26 (aprovadas pelo dono conforme a recomendação) e impacto

Continuam a numeração do backlog (D1-D17). **D27-D29 ficaram reservadas**: foram separadas no planejamento e nenhuma spec de design as usa; a spec de perfil começa em D30. Por isso a numeração salta de D26 para D30, sem decisão faltando aqui. Registro oficial em `docs/produto/backlog.md`.

| # | Decisão (recomendação aprovada) | Impacto |
|---|---|---|
| D18 | Equipamento = "exige equipamento de proteção" | Só rótulo e microcopy; campo booleano já existe. Se fosse "equipamento no local", seria lista de obstáculos (modelo novo no backend). |
| D19 | Valor da entrada paga em texto livre | Nenhum no backend (string). Sem máscara no app; validação numérica fica pós-MVP. |
| D20 | Busca do mapa só de lugar | #49 como escrita (geocoding Mapbox). Busca por nome exigiria query nova no backend: pós-MVP. |
| D21 | Nota mínima filtrada no backend | **`minRating` não existe em GP-030**: precisa de **nova issue de backend** (parâmetro no filtro e teste), antes de #50 poder entregar o filtro. Alternativa: cortar o filtro do MVP e ajustar o critério de #50. Filtrar no app foi descartado (só vê o que já carregou). |
| D22 | Editar o polígono depois de criado ("Alterar local") | **Amplia #44/#45**: a mutação de edição precisa aceitar `coordinates`, e o editor do passo 1 é reutilizado com o polígono atual. Sem isso, "Alterar local" some e o escopo diminui. |
| D23 | Limites: nome 80, descrição 1000 (comentário 500, D3) | **Validação no backend** (hoje não há) em criar/editar pico, com `VALIDATION_ERROR` por campo; mesma regra nos formulários de web e mobile. Coerente com D37 do perfil (40/40). |
| D24 | Sem rascunho do cadastro | Nenhum custo; sessão de 7 dias (D8) torna a perda rara. Rascunho viraria armazenamento local (pós-MVP). |
| D25 | TabBar com Mapa e Perfil; criar pico no FAB | Mobile: 2 abas, FAB na Home. Se virasse 3 abas, muda a navegação e a TabBar do DS. |
| D26 | Confirmar antes de excluir minha avaliação | Um sheet/dialog a mais em #66/#67; sem impacto no backend. |

---

## 16. Acessibilidade (checklist de aceite)
- Alvos >= 44 (48 padrão; visual >= 32); foco visível; ordem de foco = ordem visual; `StarInput` como grupo de rádio.
- Contraste conforme DS v2 (texto sobre laranja é escuro; `star` do DS para estrelas, nunca só cor: sempre acompanhadas do número).
- Mapa sem acesso por leitor de tela, com equivalentes (UX-P17).
- Erros anunciados; loading anunciado ("Salvando", "Carregando avaliações").
- Reduzir movimento respeitado; fonte a 130% sem truncar.
