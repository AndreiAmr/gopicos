# GoPicos - Design System (fundação de tokens)

Issue: #9 (GP-001). Status: v0.1, aguardando aprovação do dono nas decisões da seção 9.
Figma (tokens como variáveis + swatches claro/escuro): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN

Escopo desta versão: princípios, tokens e diretrizes de uso, com mapeamento para Tailwind (web) e Tamagui (mobile). Os componentes (Button, Input, StarRating, BottomSheet etc.) são especificados e implementados nas histórias GP-002/GP-003; aqui só definimos as regras que eles devem seguir (seção 8). O esboço antigo do Figma foi usado apenas como referência de conteúdo, não de estilo.

---

## 1. Princípios

1. **Legível sob sol.** O skatista usa o app na rua. Contraste alto em tudo que carrega informação (texto >= 4.5:1; bordas e ícones de controle >= 3:1). Por isso as bordas de input são mais escuras que o "cinza sutil" típico.
2. **Uma mão, polegar.** Alvos de toque mínimos de 48 px, ações primárias na metade inferior da tela, bottom sheet em vez de modal central no mobile.
3. **Rua, não escritório.** Identidade de concreto/asfalto (neutros quentes) com um único acento laranja "cone de obra / grip". Pouca decoração, tipografia forte, cantos arredondados moderados.
4. **O mapa é o protagonista.** A UI sobre o mapa é neutra e compacta; o acento é reservado para a ação principal e seleção, para não competir com os polígonos dos picos.
5. **Mesmo sistema, plataformas nativas.** Mesmos tokens e nomes de componente em web e mobile; a interação segue a plataforma (sheet no mobile, dialog no desktop).
6. **Nunca só cor.** Estado (erro, sucesso, nota) sempre vem com ícone ou texto além da cor.
7. **Todo estado desenhado.** Loading, vazio, erro, desabilitado e foco fazem parte do componente, não são extras (Definition of Done do projeto).

## 2. Nomenclatura

Tokens semânticos, nunca valores brutos nas telas: `color.bg`, `space.4`, `radius.md`. Nome em kebab-case no web (`--color-primary`) e camelCase/`$token` no Tamagui (`$primary`). **Regra: tela nenhuma usa hex, px de fonte ou raio literal**; só tokens (critério de GP-004/005).

## 3. Cores

Tema com dois modos: **claro** e **escuro**, seguindo o sistema operacional por padrão (ver decisão D1). Todas as razões abaixo foram calculadas pela fórmula WCAG 2.x de luminância relativa.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `bg` | `#F6F5F2` | `#0F0F11` | fundo de tela |
| `surface` | `#FFFFFF` | `#1A1A1E` | cards, sheets, inputs |
| `sunken` | `#ECEAE5` | `#09090A` | áreas rebaixadas, skeleton, chips inativos |
| `text` | `#17171A` | `#F5F5F6` | texto principal |
| `text-muted` | `#585861` | `#B0B0B9` | texto secundário, descrições |
| `text-subtle` | `#64646E` | `#9A9AA4` | placeholder, metadados (ainda AA) |
| `border` | `#8A8A93` | `#82828C` | borda de input/controle (>= 3:1) |
| `divider` | `#DEDCD6` | `#2E2E34` | linhas decorativas (não é controle) |
| `primary` | `#B93C08` | `#FF8A4C` | botão primário, link, seleção |
| `primary-hover` | `#9A3206` | `#FFA070` | hover/pressed do primário |
| `on-primary` | `#FFFFFF` | `#1A0B02` | texto/ícone sobre `primary` |
| `primary-soft` | `#FDE8DC` | `#3A1D0C` | fundo de destaque suave (chip selecionado) |
| `primary-text` | `#9A3206` | `#FFA070` | texto de acento sobre `surface`/`primary-soft` |
| `star` | `#C77700` | `#FBBF24` | estrela preenchida |
| `success` | `#146C35` | `#4ADE80` | sucesso |
| `error` | `#B3201F` | `#FF8A80` | erro, ação destrutiva |
| `warning` | `#8F5200` | `#FBBF24` | aviso |
| `info` | `#1D4ED8` | `#7FA8FF` | informação |
| `focus` | `#1D4ED8` | `#7FA8FF` | anel de foco (teclado/leitor de tela) |

Cor fixa para o mapa/camadas (iguais nos dois modos): `spot-fill` = `#B93C08` a 25% de opacidade e `spot-stroke` = `#B93C08` (polígono de pico); `spot-selected` = `#1D4ED8`. Decisão: o polígono usa o mesmo laranja da marca e a seleção usa azul; como a diferença de luminância entre os dois é pequena, a seleção também muda a forma: traço de 4 px (normal: 2 px), preenchimento a 40% e halo branco de 2 px por fora do traço. Assim o estado não depende só da cor.

### Contraste verificado (WCAG AA)

| Par | Claro | Escuro | Critério |
|---|---|---|---|
| `text` / `bg` | 16.41 | 17.57 | AA texto (4.5) e AAA |
| `text` / `surface` | 17.89 | 15.92 | idem |
| `text-muted` / `bg` | 6.46 | 8.90 | AA |
| `text-muted` / `surface` | 7.04 | 8.06 | AA |
| `text-subtle` / `surface` | 5.85 | 6.22 | AA |
| `text-subtle` / `bg` | 5.37 | 6.87 | AA |
| `text-subtle` / `sunken` | 4.87 | 7.14 | AA |
| `text-muted` / `sunken` | 5.85 | 9.25 | AA |
| `on-primary` / `primary` | 5.66 | 8.23 | AA |
| `on-primary` / `primary-hover` | 7.41 | 9.62 | AA |
| `primary-text` / `primary-soft` | 6.27 | 7.73 | AA |
| `primary-text` / `surface` | 7.41 | 8.69 | AA |
| `error` / `surface` | 6.68 | 7.60 | AA |
| `success` / `surface` | 6.51 | 9.96 | AA |
| `warning` / `surface` | 6.22 | 10.39 | AA |
| `info` / `surface` | 6.70 | 7.39 | AA |
| `border` / `surface` (não-texto) | 3.42 | 4.56 | AA UI (3.0) |
| `border` / `bg` (não-texto) | 3.14 | 5.03 | AA UI |
| `star` / `surface` (não-texto) | 3.46 | 10.39 | AA UI |
| `star` / `bg` (não-texto) | 3.17 | 11.47 | AA UI |
| `focus` / `surface` | 6.70 | 7.39 | AA UI |

Regras de uso:
- `primary` claro (`#B93C08`) é um laranja queimado, de propósito: o laranja vivo (`#FF6B1A`) falha com texto branco (cerca de 2.9:1). No escuro o laranja pode ser vivo porque o texto sobre ele é escuro.
- `divider` é só decoração (contraste baixo). Qualquer borda que delimite um controle usa `border`.
- Estrela vazia = contorno em `border` (ou `star` contornado) + preenchimento transparente; a nota nunca depende só da cor, o número da média sempre aparece ao lado.
- Cor de status em texto sempre acompanha ícone (ex.: erro de campo = ícone de alerta + texto).

## 4. Tipografia

Família única: **Inter** (já usada no web via Google Fonts e no mobile via `Inter18pt-*`). Uma família reduz peso do app, mantém web e mobile idênticos e Inter tem ótima legibilidade em telas pequenas e acentos do português.

Pesos usados: 400 (regular), 500 (medium), 600 (semibold), 700 (bold). Mobile: `Inter18pt-Regular/Medium/SemiBold/Bold`.

| Token | Tamanho / altura de linha | Peso | Uso |
|---|---|---|---|
| `display` | 32 / 38 | 700 | título de boas-vindas (login/cadastro) |
| `h1` | 26 / 32 | 700 | título de tela |
| `h2` | 20 / 26 | 600 | seção, nome do pico no detalhe |
| `h3` | 17 / 24 | 600 | título de card |
| `body` | 16 / 24 | 400 | texto corrido, comentários |
| `body-strong` | 16 / 24 | 600 | ênfase |
| `body-sm` | 14 / 20 | 400 | descrição de card, metadados |
| `label` | 14 / 20 | 600 | rótulo de campo, botão pequeno |
| `button` | 16 / 20 | 600 | botão padrão |
| `caption` | 12 / 16 | 500 | contagem, data, legenda (nunca para informação crítica) |

Regras: corpo mínimo 16 px em inputs (evita zoom automático do iOS Safari); máximo 12 px só em `caption`; permitir escala de fonte do sistema no mobile (`allowFontScaling`) até 1.3x, e layouts não podem truncar o essencial; linhas de texto corrido com no máximo 70 caracteres na web; sem caixa-alta corrida e sem letter-spacing negativo.

## 5. Espaçamento, raios, sombras, elevação, motion

**Espaçamento** (base 4 px): `space.0`=0, `1`=4, `2`=8, `3`=12, `4`=16, `5`=20, `6`=24, `8`=32, `10`=40, `12`=48, `16`=64. Gutter de tela: 16 (mobile e web < 640), 24 (tablet), conteúdo web com `max-width` 1120. Entre campos de formulário: `space.4`; entre seções: `space.6`.

**Alvos de toque**: mínimo `48 x 48` (tamanho de botão `lg`/inputs = 48; botão `md` = 44 só em ambientes densos de web; ícone-botão = 48 com hit-slop). Espaço entre alvos >= 8.

**Raios**: `sm`=6 (chips, tags), `md`=10 (botões, inputs), `lg`=16 (cards), `xl`=24 (bottom sheet no topo), `full`=999 (avatares, pills, FAB). Moderado, sem cantos totalmente redondos nos botões: lembra a rampa de skate, não bolha.

**Elevação e sombras** (no escuro a elevação é comunicada por `surface` mais clara + borda, sombra quase some):

| Token | Claro | Uso |
|---|---|---|
| `elevation.0` | nenhuma, borda `divider` | card no fluxo |
| `elevation.1` | `0 1px 2px rgba(23,23,26,.10)` | card clicável, input |
| `elevation.2` | `0 4px 12px rgba(23,23,26,.14)` | controles sobre o mapa, FAB, toast |
| `elevation.3` | `0 12px 32px rgba(23,23,26,.22)` | bottom sheet, dialog, menu |

No React Native: iOS usa `shadowColor/Offset/Opacity/Radius`; Android usa `elevation` 1/4/8/16 (equivalentes).

**Motion**: duração `fast` 120 ms (hover, press), `base` 200 ms (troca de estado, toast), `slow` 320 ms (sheet, transição de tela). Curva de entrada `cubic-bezier(0.2, 0, 0, 1)`, saída `cubic-bezier(0.4, 0, 1, 1)`. Press no mobile: escala 0.98 + `primary-hover`. Respeitar "reduzir movimento" (`prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled`): trocar transições por fade de 0 ms/120 ms. Nada de animação decorativa contínua, exceto o loader.

**Breakpoints web** (mobile-first): `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Mobile nativo: 1 layout, adaptando a largura; tablets fora do MVP.

**Z-index**: mapa 0, controles sobre o mapa 10, header 20, sheet/dialog 40, toast 60.

## 6. Mapeamento para Tailwind v4 + shadcn (web)

O projeto usa Tailwind v4 com `@theme inline` em `web/src/index.css` e shadcn (`new-york`, `cssVariables: true`). Os tokens viram variáveis CSS; os nomes shadcn existentes apontam para os nossos para os componentes do shadcn funcionarem sem alteração.

```css
/* 1) Valores crus do GoPicos, em namespace próprio (--gp-*) para não colidir com os nomes do shadcn */
:root {
  --gp-bg: #F6F5F2;  --gp-surface: #FFFFFF;  --gp-sunken: #ECEAE5;
  --gp-text: #17171A; --gp-text-muted: #585861; --gp-text-subtle: #64646E;
  --gp-border: #8A8A93; --gp-divider: #DEDCD6;
  --gp-primary: #B93C08; --gp-primary-hover: #9A3206; --gp-on-primary: #FFFFFF;
  --gp-primary-soft: #FDE8DC; --gp-primary-text: #9A3206;
  --gp-star: #C77700; --gp-success: #146C35; --gp-error: #B3201F;
  --gp-warning: #8F5200; --gp-info: #1D4ED8; --gp-focus: #1D4ED8;
  --gp-shadow-1: 0 1px 2px rgb(23 23 26 / .10);
  --gp-shadow-2: 0 4px 12px rgb(23 23 26 / .14);
  --gp-shadow-3: 0 12px 32px rgb(23 23 26 / .22);
}
.dark {
  --gp-bg: #0F0F11;  --gp-surface: #1A1A1E;  --gp-sunken: #09090A;
  --gp-text: #F5F5F6; --gp-text-muted: #B0B0B9; --gp-text-subtle: #9A9AA4;
  --gp-border: #82828C; --gp-divider: #2E2E34;
  --gp-primary: #FF8A4C; --gp-primary-hover: #FFA070; --gp-on-primary: #1A0B02;
  --gp-primary-soft: #3A1D0C; --gp-primary-text: #FFA070;
  --gp-star: #FBBF24; --gp-success: #4ADE80; --gp-error: #FF8A80;
  --gp-warning: #FBBF24; --gp-info: #7FA8FF; --gp-focus: #7FA8FF;
  --gp-shadow-1: 0 0 0 1px rgb(255 255 255 / .06);
  --gp-shadow-2: 0 0 0 1px rgb(255 255 255 / .08);
  --gp-shadow-3: 0 0 0 1px rgb(255 255 255 / .10), 0 12px 32px rgb(0 0 0 / .5);
}

/* 2) Ponte: nomes que o shadcn espera apontam para os tokens GoPicos (substitui os valores atuais do index.css) */
:root {
  --background: var(--gp-bg);            --foreground: var(--gp-text);
  --card: var(--gp-surface);             --card-foreground: var(--gp-text);
  --popover: var(--gp-surface);          --popover-foreground: var(--gp-text);
  --primary: var(--gp-primary);          --primary-foreground: var(--gp-on-primary);
  --secondary: var(--gp-sunken);         --secondary-foreground: var(--gp-text);
  --muted: var(--gp-sunken);             --muted-foreground: var(--gp-text-muted);
  --accent: var(--gp-sunken);            --accent-foreground: var(--gp-text);
  --destructive: var(--gp-error);
  --border: var(--gp-divider);           --input: var(--gp-border);
  --ring: var(--gp-focus);               --radius: 10px;
}

/* 3) Utilitários Tailwind v4 (bg-gp-surface, text-gp-text-muted, bg-gp-primary, shadow-2 ...) */
@theme inline {
  --color-gp-bg: var(--gp-bg);  --color-gp-surface: var(--gp-surface);  --color-gp-sunken: var(--gp-sunken);
  --color-gp-text: var(--gp-text);  --color-gp-text-muted: var(--gp-text-muted);  --color-gp-text-subtle: var(--gp-text-subtle);
  --color-gp-border: var(--gp-border);  --color-gp-divider: var(--gp-divider);
  --color-gp-primary: var(--gp-primary);  --color-gp-primary-hover: var(--gp-primary-hover);  --color-gp-on-primary: var(--gp-on-primary);
  --color-gp-primary-soft: var(--gp-primary-soft);  --color-gp-primary-text: var(--gp-primary-text);
  --color-gp-star: var(--gp-star);  --color-gp-success: var(--gp-success);  --color-gp-error: var(--gp-error);
  --color-gp-warning: var(--gp-warning);  --color-gp-info: var(--gp-info);  --color-gp-focus: var(--gp-focus);
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-xl: 24px;
  --shadow-1: var(--gp-shadow-1); --shadow-2: var(--gp-shadow-2); --shadow-3: var(--gp-shadow-3);
  --text-display: 2rem;  --text-display--line-height: 2.375rem;
  --text-h1: 1.625rem;   --text-h1--line-height: 2rem;
  --text-h2: 1.25rem;    --text-h2--line-height: 1.625rem;
  --text-h3: 1.0625rem;  --text-h3--line-height: 1.5rem;
  --text-body: 1rem;     --text-body--line-height: 1.5rem;
  --text-body-sm: .875rem; --text-body-sm--line-height: 1.25rem;
  --text-caption: .75rem;  --text-caption--line-height: 1rem;
  --breakpoint-sm: 640px; --breakpoint-md: 768px; --breakpoint-lg: 1024px; --breakpoint-xl: 1280px;
}
```

Observação: os valores crus (`--gp-*`) mudam por modo (`:root` / `.dark`). O bloco de ponte faz o shadcn ler os mesmos valores, então os componentes do shadcn mudam de tema sem alteração. Em telas novas, prefira os utilitários `gp-*` (`bg-gp-surface`, `text-gp-text-muted`); as classes semânticas do shadcn (`bg-primary`, `bg-background`) também funcionam, pois apontam para o mesmo token. O namespace `gp-` evita colisão com `--primary`, `--border` etc. que já existem no `index.css`.

**Ponte com shadcn** (nomes que o shadcn espera):

| shadcn | Token GoPicos |
|---|---|
| `--background` | `bg` |
| `--foreground` | `text` |
| `--card`, `--popover` | `surface` |
| `--card-foreground`, `--popover-foreground` | `text` |
| `--primary` / `--primary-foreground` | `primary` / `on-primary` |
| `--secondary`, `--muted`, `--accent` | `sunken` |
| `--secondary-foreground`, `--accent-foreground` | `text` |
| `--muted-foreground` | `text-muted` |
| `--destructive` | `error` |
| `--border` | `divider` (cartões) |
| `--input` | `border` (campos de formulário, exige 3:1) |
| `--ring` | `focus` |
| `--radius` | `10px` (md) |

Modo escuro: classe `.dark` no `<html>` (já existe `@custom-variant dark`); por padrão segue `prefers-color-scheme`, com o toggle opcional (D1). Corrigir no `index.css` atual: a cor do `:root` está fixa em branco/escuro (`#242424`) e `h1` com `3.2em`, o que conflita com o DS; isso é trabalho do GP-002/004, não deste PR.

## 7. Mapeamento para Tamagui (mobile)

O mobile hoje usa `defaultConfig` do `@tamagui/config/v5` com `themes` comentado. Proposta: definir tokens e dois temas (`light`, `dark`) próprios e passá-los ao `createTamagui`, mantendo `defaultConfig` apenas para media queries/animations. Sem código de produção aqui; esta é a especificação para o Dev:

```ts
// mobile/src/config/tamagui/tokens.ts (especificação)
const color = {
  // claro
  bgLight: '#F6F5F2', surfaceLight: '#FFFFFF', /* ...tabela da seção 3 */
};
export const tokens = createTokens({
  color: { /* mesmos valores da seção 3, nomes camelCase */ },
  space:  { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, true: 16 },
  size:   { /* igual a space + touch: 48 */ touch: 48 },
  radius: { sm: 6, md: 10, lg: 16, xl: 24, full: 999, true: 10 },
  zIndex: { map: 0, mapControls: 10, header: 20, sheet: 40, toast: 60 },
});

// temas: nomes semânticos iguais aos do web
const light = { bg, surface, sunken, text, textMuted, textSubtle, border, divider,
  primary, primaryHover, onPrimary, primarySoft, primaryText, star, success, error, warning, info, focus };
const dark = { /* mesmos nomes, valores escuros */ };
export const config = createTamagui({ ...defaultConfig, tokens, themes: { light, dark } });
```

Os temas devem referenciar os tokens de cor com `$` (definidos em `createTokens`) em vez de repetir hex, para que haja uma única fonte de valores. Atenção: o `tamagui.config.ts` atual usa `defaultConfig` v5 com `themes` comentado; o Dev deve verificar a API real instalada (Tamagui ^2.5.1) na GP-003 antes de aplicar o esboço acima, que é ilustrativo.

Uso: `color="$text"`, `backgroundColor="$surface"`, `borderColor="$border"`, `padding="$4"`, `borderRadius="$md"`. Dark/claro automático via `useColorScheme` do React Native passado como `defaultTheme`/`<TamaguiProvider>`.

Fontes: `createInterFont` com `size` (display 32, h1 26, h2 20, h3 17, body 16, bodySm 14, caption 12), `lineHeight` correspondentes e `weight` 400/500/600/700, `face` mapeando cada peso para `Inter18pt-*`. O objeto `theme` de `mobile/src/constants/theme.ts` (cores soltas) deve ser substituído pelos tokens e removido em GP-005.

Sombras: componente `Card`/`Sheet` usa `shadowColor` do token + `elevation` Android conforme a seção 5.

## 8. Diretrizes para os componentes (GP-002/003)

Valem as regras abaixo, que a Issue de componentes detalha:

- **Button**: variantes `primary`, `secondary` (borda `border`, fundo `surface`), `ghost`, `destructive`; tamanhos `lg` 48 (padrão no mobile) e `md` 44; estados default, hover (web), pressed, focus, disabled (opacidade 0.4 + texto não carrega informação sozinho), loading (spinner no lugar do rótulo, largura mantida, desabilita toque).
- **Input**: altura 48, fonte 16, borda `border`, foco com anel `focus` 2 px, erro com borda `error` + ícone + mensagem abaixo; rótulo sempre visível acima (nunca só placeholder).
- **StarRating**: 5 estrelas de 32 px (entrada, alvo 48 com espaço) e 16 px (leitura). Mostra média com 1 casa decimal e contagem ("4,3 (12)"). Entrada acessível: radiogroup "Nota de 1 a 5 estrelas".
- **Card de pico**: `surface`, raio `lg`, `elevation.1`, imagem 16:9 no topo, nome (`h3`), modalidade (chip), estrelas + média, distância/local em `caption`.
- **BottomSheet/Dialog**: mobile usa sheet com raio `xl` no topo e alça; web usa dialog centralizado (`<640px` vira sheet). Fecha por gesto, botão e Esc.
- **Toast**: `elevation.2`, 4 s, ícone + texto, aviso de erro nunca some sozinho se exigir ação; `aria-live="polite"` (web) / anúncio do leitor de tela (mobile).
- **Vazio/Erro/Loading**: vazio = ilustração simples + texto + ação ("Nenhum pico por aqui ainda. Cadastre o primeiro."); erro = mensagem amigável + "Tentar novamente"; loading = skeleton com `sunken` (não spinner de tela cheia, exceto no mapa).

Microcopy: sempre pt-BR, tom direto e informal-respeitoso ("você"), textos centralizados em arquivo de strings (preparado para tradução futura, conforme visão). Modalidades exibidas como: Street, Park, Bowl/Pool, Vertical, Downhill, Mista. Conta desativada exibe "Usuário Desativado".

Acessibilidade geral: foco visível sempre (nunca `outline: none` sem substituto), `accessibilityLabel`/`aria-label` em ícones-botão, ordem de foco lógica, rótulos de estrela como "3 de 5 estrelas", contraste conforme seção 3, testar com 130% de fonte.

## 9. Decisões e justificativas

**D1. Modo claro e escuro: ambos, seguindo o sistema.** O backlog dizia "se decidido". Decisão: entregar os dois nos tokens agora, porque o custo é mínimo quando feito desde a fundação (refazer depois custa muito) e o mapa em modo noturno é um uso real (skate à noite). Toggle manual fica como opção pós-MVP; no MVP segue o tema do sistema. **Precisa de confirmação do dono** (se preferir só claro no MVP, a implementação pode ficar só com o tema claro sem retrabalho).

**D2. Acento laranja queimado, neutros quentes.** Evita o azul genérico de apps de mapa (a base do Google/Mapbox já é azul/verde) e remete a asfalto + cone/grip. O laranja foi escurecido para passar AA com texto branco. **Precisa de confirmação do dono** (cor da marca); trocar o acento é mudar 5 tokens.

**D3. Bordas de input fortes (3:1).** Bordas claras ficam invisíveis sob sol e seriam reprovadas pelo AA de componentes não-textuais. Custo: visual um pouco mais marcado; benefício: legibilidade em campo.

**D4. Alvos de 48 px e fonte base 16.** Uso com uma mão, às vezes com luva ou pressa; 16 px impede zoom automático em inputs no iOS.

**D5. Inter como única família.** Já está no projeto, cobre pt-BR e unifica web/mobile.

**D6. Base de 4 px e poucos raios.** Menos escolhas = telas mais consistentes e fáceis de implementar. Raios moderados dão personalidade sem custo.

**D7. Tokens semânticos, não paleta bruta.** Trocar tema e marca vira trocar valores, não caçar usos. Os nomes do shadcn são mapeados em vez de reescritos, para não quebrar componentes do Radix/shadcn.

**D8. Estrela com cor `star` + contorno + número.** O amarelo clássico (`#FACC15`) não tem 3:1 sobre fundo claro (cerca de 1.5:1); usamos âmbar escuro no claro e amarelo vivo no escuro, e o número sempre acompanha.

**D9. Figma no plano gratuito.** O plano Starter permite apenas 1 modo por coleção de variáveis; por isso no Figma há duas coleções (`color-light` e `color-dark`) com os mesmos nomes. A fonte de verdade dos valores é este documento. Os frames "Cores - light/dark" na página Tokens mostram todos os swatches.

## 10. Ideias pós-MVP
- Toggle manual de tema (claro/escuro/sistema) no perfil.
- Paleta de alto contraste opcional para sol forte.
- Ícones de modalidade próprios; ilustrações de estado vazio com identidade de skate.
- Tema por modalidade no mapa (cor do polígono por modalidade).
- Suporte a tablet/dobráveis no mobile.

## 11. Pendências para o dono
1. Aprovar acento laranja queimado como cor da marca (D2).
2. Confirmar claro + escuro desde o MVP, seguindo o sistema (D1).
3. Existe nome/logo definitivo? O DS ainda não define logotipo.
