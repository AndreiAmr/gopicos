# GoPicos - Design System (fundação de tokens)

Issue: #9 (GP-001). Status: **v2.0** (atualização para a linguagem visual do modelo do dono: paleta laranja, neutros frios, raios menores, marca com logo). A v1.0 foi aprovada anteriormente com acento laranja queimado; a v2.0 troca **apenas valores de token** (nomes `--gp-*` e nomes Tamagui iguais), ver seção 12.
Figma (tokens como variáveis + swatches claro/escuro): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN

Modelo do dono (login): https://www.figma.com/design/3VexamkeziZHB1RPfTKedg/GO-picos?node-id=16-37 . Logo provisório (extraído do modelo): `docs/design/assets/logo-gopicos.svg`.

Escopo desta versão: princípios, tokens e diretrizes de uso, com mapeamento para Tailwind (web) e Tamagui (mobile). Os componentes (Button, Input, StarRating, BottomSheet etc.) são especificados e implementados nas histórias GP-002/GP-003; aqui só definimos as regras que eles devem seguir (seção 8). O esboço antigo do Figma foi usado apenas como referência de conteúdo, não de estilo.

---

## 1. Princípios

1. **Legível sob sol.** O skatista usa o app na rua. Contraste alto em tudo que carrega informação (texto >= 4.5:1; bordas e ícones de controle >= 3:1). Por isso as bordas de input são mais escuras que o "cinza sutil" típico.
2. **Uma mão, polegar.** Alvos de toque mínimos de 48 px, ações primárias na metade inferior da tela, bottom sheet em vez de modal central no mobile.
3. **Rua, não escritório.** Identidade limpa e direta: fundo cinza-azulado claro (como o modelo do dono), superfícies brancas, **um único acento laranja vivo** ("cone de obra / grip") que conversa com o amarelo da marca. Laranja de verdade, não terracota nem vermelho. Pouca decoração, tipografia forte, cantos arredondados moderados.
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
| `bg` | `#F0F3F5` | `#0F1113` | fundo de tela |
| `surface` | `#FFFFFF` | `#181B1F` | cards, sheets, inputs |
| `sunken` | `#E3E8EC` | `#0A0B0D` | áreas rebaixadas, skeleton, chips inativos |
| `text` | `#18181B` | `#F5F6F7` | texto principal |
| `text-muted` | `#565757` | `#B2B8BE` | texto secundário, rótulos de campo, descrições |
| `text-subtle` | `#5C646A` | `#9AA1A8` | placeholder, metadados (ainda AA) |
| `border` | `#7D858C` | `#838B93` | borda de input/controle (>= 3:1) |
| `divider` | `#D5DBE0` | `#2C3138` | linhas decorativas (não é controle) |
| `primary` | `#F97316` | `#FB923C` | fundo do botão primário, seleção, acento |
| `primary-hover` | `#EA580C` | `#FDBA74` | hover/pressed do primário |
| `on-primary` | `#18181B` | `#1A0B02` | texto/ícone sobre `primary` |
| `primary-soft` | `#FFEDD5` | `#3A2008` | fundo de destaque suave (chip selecionado) |
| `primary-text` | `#A84300` | `#FDBA74` | **texto e links em laranja** sobre `surface`/`bg`/`primary-soft` |
| `star` | `#C77700` | `#FBBF24` | estrela preenchida |
| `success` | `#146C35` | `#4ADE80` | sucesso |
| `error` | `#B3201F` | `#FF8A80` | erro, ação destrutiva |
| `warning` | `#8F5200` | `#FBBF24` | aviso |
| `info` | `#1D4ED8` | `#7FA8FF` | informação |
| `focus` | `#1D4ED8` | `#7FA8FF` | anel de foco (teclado/leitor de tela) |

Cor fixa para o mapa/camadas (iguais nos dois modos): `spot-fill` = `#EA580C` a 25% de opacidade e `spot-stroke` = `#EA580C` (polígono de pico); `spot-selected` = `#1D4ED8`. Decisão: o polígono usa o mesmo laranja da marca e a seleção usa azul; como a diferença de luminância entre os dois é pequena, a seleção também muda a forma: traço de 4 px (normal: 2 px), preenchimento a 40% e halo branco de 2 px por fora do traço. Assim o estado não depende só da cor.

### Contraste verificado (WCAG AA)

| Par | Claro | Escuro | Critério |
|---|---|---|---|
| `text` / `bg` | 15.90 | 17.49 | AA e AAA |
| `text` / `surface` | 17.72 | 15.97 | AA e AAA |
| `text-muted` / `bg` | 6.51 | 9.45 | AA texto (4.5) |
| `text-muted` / `surface` | 7.25 | 8.63 | AA texto (4.5) |
| `text-muted` / `sunken` | 5.88 | 9.84 | AA texto (4.5) |
| `text-subtle` / `surface` | 6.02 | 6.61 | AA texto (4.5) |
| `text-subtle` / `bg` | 5.41 | 7.24 | AA texto (4.5) |
| `text-subtle` / `sunken` | 4.88 | 7.54 | AA texto (4.5) |
| `on-primary` / `primary` | 6.32 | 8.49 | AA texto (4.5) |
| `on-primary` / `primary-hover` | 4.98 | 11.40 | AA texto (4.5) |
| `primary-text` / `primary-soft` | 5.28 | 8.96 | AA texto (4.5) |
| `primary-text` / `surface` | 6.06 | 10.25 | AA texto (4.5) |
| `primary-text` / `bg` | 5.43 | 11.22 | AA texto (4.5) |
| `error` / `surface` | 6.68 | 7.57 | AA texto (4.5) |
| `success` / `surface` | 6.51 | 9.92 | AA texto (4.5) |
| `warning` / `surface` | 6.22 | 10.35 | AA texto (4.5) |
| `info` / `surface` | 6.70 | 7.36 | AA texto (4.5) |
| `border` / `surface` (não-texto) | 3.75 | 5.00 | AA UI (3.0) |
| `border` / `bg` (não-texto) | 3.36 | 5.48 | AA UI (3.0) |
| `star` / `surface` (não-texto) | 3.46 | 10.35 | AA UI (3.0) |
| `star` / `bg` (não-texto) | 3.11 | 11.33 | AA UI (3.0) |
| `focus` / `surface` (não-texto) | 6.70 | 7.36 | AA UI (3.0) |
| `focus` / `bg` (não-texto) | 6.01 | 8.06 | AA UI (3.0) |

Regras de uso:
- **O laranja vivo é o fundo do botão, o texto sobre ele é escuro.** `primary` claro = `#F97316` (laranja vivo). Branco sobre ele dá só 2,80:1 (reprova AA), por isso `on-primary` é o `text` quase preto (6,32:1). É a mesma lógica que já usávamos no escuro. Se o dono preferir **texto branco** no botão, a alternativa AA é um laranja mais escuro (`#C45500`, 4,52:1 com branco), documentada na decisão D11.
- **Texto e links em laranja nunca usam `primary`**: usam `primary-text` (`#A84300` claro, 6,06:1 sobre branco), que é o tom de texto separado. Ícones e bordas laranja de decoração podem usar `primary`.
- `primary` sobre `bg` claro tem apenas 2,52:1: por isso o botão sempre leva rótulo (o rótulo identifica o controle) e o anel de foco usa `focus` (azul), nunca laranja.
- `divider` é só decoração. Qualquer borda que delimite um controle usa `border`.
- **Marca**: o logo usa o amarelo `#FACC15` (`brand-yellow`), fixo nos dois modos e **exclusivo do logo** (não é token de UI; sobre o amarelo o glifo é branco e decorativo, o nome acompanha em texto).
- Estrela vazia = contorno em `border` + preenchimento transparente; a nota nunca depende só da cor, o número da média sempre aparece ao lado.
- Cor de status em texto sempre acompanha ícone (ex.: erro de campo = ícone de alerta + texto).

## 4. Tipografia

Família única: **Inter** (já usada no web via Google Fonts e no mobile via `Inter18pt-*`). Uma família reduz peso do app, mantém web e mobile idênticos e Inter tem ótima legibilidade em telas pequenas e acentos do português.

Pesos usados: 400 (regular), 500 (medium), 600 (semibold), 700 (bold). Mobile: `Inter18pt-Regular/Medium/SemiBold/Bold`.

| Token | Tamanho / altura de linha | Peso | Uso |
|---|---|---|---|
| `display` | 32 / 38 | 700 | título de página de marketing/vazio grande |
| `h1` | 26 / 32 | 700 | título de tela |
| `h2` | 20 / 26 | 600 | seção, nome do pico no detalhe |
| `h3` | 17 / 24 | 600 | título de card |
| `body` | 16 / 24 | 400 | texto corrido, comentários |
| `body-strong` | 16 / 24 | 600 | ênfase |
| `body-sm` | 14 / 20 | 400 | descrição de card, metadados |
| `label` | 14 / 20 | 500 | rótulo de campo (cor `text-muted`, acima do campo, como no modelo), botão pequeno |
| `button` | 16 / 20 | 600 | botão padrão |
| `caption` | 12 / 16 | 500 | contagem, data, legenda (nunca para informação crítica) |
| `wordmark` | 40 / 44 (compacto 28 / 32) | 400, fonte **display** | nome "GoPicos" ao lado do logo (cor `text`), só marca |
| `title-brand` | 34 / 40 (mobile 30 / 36) | 400, fonte **display** | título de telas de entrada (login, cadastro), vazio e destaques; nunca abaixo de 24 px |
| `tagline` | 14 / 20 | 400 | frase da marca sob o nome (cor `text-muted`) |

O modelo do dono usa tamanhos pequenos (12 px nos campos, 14 px no nome). Mantivemos a **família, os pesos e a hierarquia** (nome em negrito, frase e rótulos em cinza regular, link de apoio sublinhado), mas com a escala acima, que respeita o mínimo de legibilidade (ver D12).

Regras: corpo mínimo 16 px em inputs (evita zoom automático do iOS Safari); máximo 12 px só em `caption`; permitir escala de fonte do sistema no mobile (`allowFontScaling`) até 1.3x, e layouts não podem truncar o essencial; linhas de texto corrido com no máximo 70 caracteres na web; sem caixa-alta corrida e sem letter-spacing negativo.

## 5. Espaçamento, raios, sombras, elevação, motion

**Espaçamento** (base 4 px): `space.0`=0, `1`=4, `2`=8, `3`=12, `4`=16, `5`=20, `6`=24, `8`=32, `10`=40, `12`=48, `16`=64. Gutter de tela: 16 (mobile e web < 640), 24 (tablet), conteúdo web com `max-width` 1120. Entre campos de formulário: `space.4`; entre seções: `space.6`.

**Alvos de toque**: mínimo `48 x 48` (tamanho de botão `lg`/inputs = 48; botão `md` = 44 só em ambientes densos de web; ícone-botão = 48 com hit-slop). Espaço entre alvos >= 8.

**Raios** (v2.0, mais retos, como o modelo do dono, que usa 5 px em campos e botões e 10 px no logo): `sm`=4 (chips, tags, checkbox), `md`=6 (botões, inputs), `lg`=12 (cards, logo), `xl`=20 (bottom sheet no topo), `full`=999 (avatares, pills, FAB).

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
  --gp-bg: #F0F3F5;  --gp-surface: #FFFFFF;  --gp-sunken: #E3E8EC;
  --gp-text: #18181B; --gp-text-muted: #565757; --gp-text-subtle: #5C646A;
  --gp-border: #7D858C; --gp-divider: #D5DBE0;
  --gp-primary: #F97316; --gp-primary-hover: #EA580C; --gp-on-primary: #18181B;
  --gp-primary-soft: #FFEDD5; --gp-primary-text: #A84300;
  --gp-star: #C77700; --gp-success: #146C35; --gp-error: #B3201F;
  --gp-warning: #8F5200; --gp-info: #1D4ED8; --gp-focus: #1D4ED8;
  --gp-shadow-1: 0 1px 2px rgb(24 24 27 / .10);
  --gp-shadow-2: 0 4px 12px rgb(24 24 27 / .14);
  --gp-shadow-3: 0 12px 32px rgb(24 24 27 / .22);
}
.dark {
  --gp-bg: #0F1113;  --gp-surface: #181B1F;  --gp-sunken: #0A0B0D;
  --gp-text: #F5F6F7; --gp-text-muted: #B2B8BE; --gp-text-subtle: #9AA1A8;
  --gp-border: #838B93; --gp-divider: #2C3138;
  --gp-primary: #FB923C; --gp-primary-hover: #FDBA74; --gp-on-primary: #1A0B02;
  --gp-primary-soft: #3A2008; --gp-primary-text: #FDBA74;
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
  --ring: var(--gp-focus);               --radius: 6px;
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
  --radius-sm: 4px; --radius-md: 6px; --radius-lg: 12px; --radius-xl: 20px;
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
| `--radius` | `6px` (md) |

Modo escuro: classe `.dark` no `<html>` (já existe `@custom-variant dark`); por padrão segue `prefers-color-scheme`, com o toggle opcional (D1). Corrigir no `index.css` atual: a cor do `:root` está fixa em branco/escuro (`#242424`) e `h1` com `3.2em`, o que conflita com o DS; isso é trabalho do GP-002/004, não deste PR.

## 7. Mapeamento para Tamagui (mobile)

O mobile hoje usa `defaultConfig` do `@tamagui/config/v5` com `themes` comentado. Proposta: definir tokens e dois temas (`light`, `dark`) próprios e passá-los ao `createTamagui`, mantendo `defaultConfig` apenas para media queries/animations. Sem código de produção aqui; esta é a especificação para o Dev:

```ts
// mobile/src/config/tamagui/tokens.ts (especificação)
const color = {
  // claro
  bgLight: '#F0F3F5', surfaceLight: '#FFFFFF', /* ...tabela da seção 3 */
};
export const tokens = createTokens({
  color: { /* mesmos valores da seção 3, nomes camelCase */ },
  space:  { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, true: 16 },
  size:   { /* igual a space + touch: 48 */ touch: 48 },
  radius: { sm: 4, md: 6, lg: 12, xl: 20, full: 999, true: 6 },
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

- **Visual dos controles (v2.0, do modelo do dono)**: campo em `surface` sobre `bg` frio, raio `md` (6), rótulo `label` em `text-muted` acima, **borda `border` mantida** (1,5 px; ver D13). Botão primário: fundo `primary`, texto `on-primary` em `button` 600, raio `md`, largura total no mobile.
- **Link de apoio** (`TextLink` quiet): `body-sm` em `text-muted`, sublinhado; ex.: "Esqueci minha senha". **Link de ação** (`TextLink`): `primary-text`, 600, sublinhado; ex.: "Cadastre-se".
- **Divisor com ação** (`DividerLink`): linha `divider` de 1 px e, abaixo, o link de ação centralizado.
- **Wordmark / logo**: marca `logo-gopicos.svg` (30x34, tile amarelo com pino) + "GoPicos" em `wordmark` (fonte display) cor `text`, alinhados na horizontal (gap `space.2`), com **traço de spray** `primary` logo abaixo (sem sobrepor o texto), e `tagline` (Inter) abaixo. Tamanho mínimo da marca 24 px de altura.
- **Stepper** (progresso de cadastro em etapas): texto "Passo {n} de {total}" em `label` + barra segmentada (um segmento por passo, altura 4, raio `full`; concluídos e atual em `primary`, futuros em `divider`). Nunca só cor: o texto diz o passo.
- **Checkbox**: caixa 24 (alvo 48), raio `sm`, borda `border` 2 px, marcado = fundo `primary` + check `on-primary`, foco anel `focus`, erro borda `error` + mensagem.
- **Button**: variantes `primary`, `secondary` (borda `border`, fundo `surface`), `ghost`, `destructive`; tamanhos `lg` 48 (padrão no mobile) e `md` 44; estados default, hover (web), pressed, focus, disabled (opacidade 0.4 + texto não carrega informação sozinho), loading (spinner no lugar do rótulo, largura mantida, desabilita toque).
- **Input**: altura 48 (o modelo tem 35: ver D12), fonte 16, borda `border`, foco com anel `focus` 2 px, erro com borda `error` + ícone + mensagem abaixo; rótulo sempre visível acima (nunca só placeholder).
- **StarRating**: 5 estrelas de 32 px (entrada, alvo 48 com espaço) e 16 px (leitura). Mostra média com 1 casa decimal e contagem ("4,3 (12)"). Entrada acessível: radiogroup "Nota de 1 a 5 estrelas".
- **Card de pico**: `surface`, raio `lg`, `elevation.1`, imagem 16:9 no topo, nome (`h3`), modalidade (chip), estrelas + média, distância/local em `caption`.
- **BottomSheet/Dialog**: mobile usa sheet com raio `xl` no topo e alça; web usa dialog centralizado (`<640px` vira sheet). Fecha por gesto, botão e Esc.
- **Toast**: `elevation.2`, 4 s, ícone + texto, aviso de erro nunca some sozinho se exigir ação; `aria-live="polite"` (web) / anúncio do leitor de tela (mobile).
- **Vazio/Erro/Loading**: vazio = ilustração simples + texto + ação ("Nenhum pico por aqui ainda. Cadastre o primeiro."); erro = mensagem amigável + "Tentar novamente"; loading = skeleton com `sunken` (não spinner de tela cheia, exceto no mapa).

Microcopy: sempre pt-BR, tom direto e informal-respeitoso ("você"), textos centralizados em arquivo de strings (preparado para tradução futura, conforme visão). Modalidades exibidas como: Street, Park, Bowl/Pool, Vertical, Downhill, Mista. Conta desativada exibe "Usuário Desativado".

Acessibilidade geral: foco visível sempre (nunca `outline: none` sem substituto), `accessibilityLabel`/`aria-label` em ícones-botão, ordem de foco lógica, rótulos de estrela como "3 de 5 estrelas", contraste conforme seção 3, testar com 130% de fonte.

## 9. Decisões e justificativas

**D1. Modo claro e escuro: ambos, seguindo o sistema.** O backlog dizia "se decidido". Decisão: entregar os dois nos tokens agora, porque o custo é mínimo quando feito desde a fundação (refazer depois custa muito) e o mapa em modo noturno é um uso real (skate à noite). Toggle manual fica como opção pós-MVP; no MVP segue o tema do sistema. **Precisa de confirmação do dono** (se preferir só claro no MVP, a implementação pode ficar só com o tema claro sem retrabalho).

**D2 (substituída pela D10 na v2.0). Acento laranja queimado, neutros quentes.** Evita o azul genérico de apps de mapa (a base do Google/Mapbox já é azul/verde) e remete a asfalto + cone/grip. O laranja foi escurecido para passar AA com texto branco. **Precisa de confirmação do dono** (cor da marca); trocar o acento é mudar 5 tokens.

**D3. Bordas de input fortes (3:1).** Bordas claras ficam invisíveis sob sol e seriam reprovadas pelo AA de componentes não-textuais. Custo: visual um pouco mais marcado; benefício: legibilidade em campo.

**D4. Alvos de 48 px e fonte base 16.** Uso com uma mão, às vezes com luva ou pressa; 16 px impede zoom automático em inputs no iOS.

**D5. Inter como única família.** Já está no projeto, cobre pt-BR e unifica web/mobile.

**D6. Base de 4 px e poucos raios.** Menos escolhas = telas mais consistentes e fáceis de implementar. Raios moderados dão personalidade sem custo.

**D7. Tokens semânticos, não paleta bruta.** Trocar tema e marca vira trocar valores, não caçar usos. Os nomes do shadcn são mapeados em vez de reescritos, para não quebrar componentes do Radix/shadcn.

**D8. Estrela com cor `star` + contorno + número.** O amarelo clássico (`#FACC15`) não tem 3:1 sobre fundo claro (cerca de 1.5:1); usamos âmbar escuro no claro e amarelo vivo no escuro, e o número sempre acompanha.

**D9. Figma no plano gratuito.** O plano Starter permite apenas 1 modo por coleção de variáveis; por isso no Figma há duas coleções (`color-light` e `color-dark`) com os mesmos nomes. A fonte de verdade dos valores é este documento. Os frames "Cores - light/dark" na página Tokens mostram todos os swatches.

**D10 (v2.0). Laranja vivo como cor principal, e por quê.** O dono pediu cores principais laranja, não vermelho. O acento anterior (`#B93C08`, matiz 18 graus) é um terracota que lê como vermelho-escuro. O novo `primary` `#F97316` (matiz 25) é inequivocamente laranja e combina com o amarelo `#FACC15` da marca; no escuro, `#FB923C` (mesmo matiz, mais claro).

**D11 (v2.0). Texto escuro sobre o laranja (e a alternativa).** Branco sobre laranja vivo reprova AA (2,80:1). Em vez de escurecer o laranja até ficar marrom, o botão fica laranja vivo e o texto `on-primary` é quase preto (6,32:1, AA), igual ao modo escuro. Links e textos em laranja usam um tom separado, `primary-text` (`#A84300`, 6,06:1). **Alternativa (precisa de escolha do dono se preferir texto branco no botão):** `primary` = `#C45500` e `on-primary` = `#FFFFFF` (4,52:1); fica um laranja mais fechado. Trocar é mudar 3 tokens.

**D12 (v2.0). Tamanhos do modelo vs. legibilidade.** O modelo usa campos de 35 px de altura e fonte de 10 a 14 px. Para uso na rua, com uma mão e sob sol, mantemos campos de 48 px (alvo de toque), fonte 16 px nos inputs (evita zoom do iOS) e mínimo 14 px nos textos de apoio. Mantemos o **layout, a hierarquia, o estilo e as proporções relativas** do modelo.

**D13 (v2.0). Borda de campo mantida.** No modelo os campos brancos não têm borda sobre o fundo cinza (contraste de cerca de 1,1:1), o que reprova o AA de componentes (3:1). Mantemos uma borda `border` de 1,5 px, mais suave que a anterior (cinza-azulado). Se o dono quiser o visual sem borda, a alternativa é aceitar o contraste menor apenas com rótulo sempre visível e foco forte; não recomendamos.

**D14 (v2.0). Neutros frios, raios menores.** O modelo usa fundo `#F0F3F5` (cinza-azulado), texto `#18181B` e cinza `#565757`; adotamos esses valores como `bg`, `text` e `text-muted`, e derivamos os demais neutros (e os do escuro) na mesma temperatura. Os raios caem de 10 para 6 em controles (modelo: 5).

**D15 (v2.0). Logo.** A marca (pino amarelo com skatista, extraída do modelo) entra como `logo-gopicos.svg` provisório; o dono deve fornecer o arquivo final. O amarelo é exclusivo do logo.

## 10. Ideias pós-MVP
- Toggle manual de tema (claro/escuro/sistema) no perfil.
- Paleta de alto contraste opcional para sol forte.
- Ícones de modalidade próprios; ilustrações de estado vazio com identidade de skate.
- Tema por modalidade no mapa (cor do polígono por modalidade).
- Suporte a tablet/dobráveis no mobile.

## 11. Pendências para o dono
0b. (v2.0, marca) Aprovar a direção de expressão de marca "rua, skate, grafite" e a fonte display Permanent Marker (seção 13).
0. (v2.0) Confirmar texto escuro sobre o laranja (D11) ou preferir branco com laranja mais escuro; confirmar borda de campo (D13); fornecer o logo final (D15).
1. (resolvida na v2.0: laranja vivo, ver D10 e D11.)
2. Confirmar claro + escuro desde o MVP, seguindo o sistema (D1).
3. Existe nome/logo definitivo? O DS ainda não define logotipo.

## 12. Histórico e mudanças da v2.0 (para os devs)

Troca de **valores**, sem renomear tokens:
- Cores claro/escuro: `bg`, `surface` (escuro), `sunken`, `text`, `text-muted`, `text-subtle`, `border`, `divider`, `primary`, `primary-hover`, `on-primary`, `primary-soft`, `primary-text` (tabela da seção 3; `surface` claro, `star`, `success`, `error`, `warning`, `info` e `focus` **não mudam** de valor, exceto `surface` escuro).
- Raios: `sm` 6->4, `md` 10->6, `lg` 16->12, `xl` 24->20 (`--radius` do shadcn 10->6).
- Mapa: `spot-fill`/`spot-stroke` de `#B93C08` para `#EA580C`.
- Sombras claras: base `rgb(24 24 27)` no lugar de `rgb(23 23 26)` (imperceptível).
- Tipografia: novos tokens `wordmark` e `tagline`; `label` passa a peso 500 e cor `text-muted`; `display` deixa de ser usado em login/cadastro.
- Componentes novos: `Wordmark`/logo, `TextLink` (default e quiet), `DividerLink`, `Stepper`, `Checkbox` (especificados na seção 8). Ajustes: `Button` primário agora com texto escuro (`on-primary`), `Input` com raio 6 e rótulo em `text-muted`.

## 13. Camada de expressão de marca (rua, skate, grafite)

Diretriz do dono: o app é para skatistas, então o visual deve ser **moderno e atraente** para esse público, com tags e grafite. Para isso o DS ganha uma **camada de expressão de marca**, separada dos componentes funcionais: ela dá personalidade, mas **nunca** substitui a camada funcional (campos, botões, textos de leitura, erros), que continua limpa, acessível e rápida.

Prancha de direção (moodboard + componentes de marca): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=22-3

### 13.1 Direção em poucas linhas
Concreto limpo (neutros frios) + laranja vivo + amarelo de fita/sticker; títulos escritos à mão com marcador (grafite legível), traço de spray sublinhando o título, fita adesiva e meio-tom nos cantos, chips como stickers com sombra rígida. Tudo é vetor e decorativo; o formulário fica limpo.

### 13.2 Tipografia de marca
- **Fonte display: Permanent Marker** (Font Diner), **licença Apache 2.0**, uso comercial permitido, distribuída pelo Google Fonts. Escolhida por ser grafite/marcador **legível** (traço uniforme, letras abertas), ao contrário de fontes de spray ou wildstyle que ficam ilegíveis no mobile.
- Usada **só** em `wordmark`, `title-brand`, destaques curtos e no rótulo decorativo da fita. **Mínimo 24 px**, uma linha por vez, até cerca de 25 caracteres. Corpo, campos, botões, chips, mensagens, links e erros continuam em **Inter** (OFL).
- Web: `@import` do Google Fonts (`family=Permanent+Marker`) com `font-display: swap` ou arquivo local em `woff2` (uma fonte, ~60 KB); `--font-display: 'Permanent Marker', 'Inter', system-ui, sans-serif`. Mobile: incluir `PermanentMarker-Regular.ttf` nos assets nativos (família `Permanent Marker`, peso único 400; **não usar `fontWeight` bold**, que simularia negrito).
- Fonte alternativa se o dono quiser mais "sinalização": **Bungee** (OFL). Trocar é trocar um token.

### 13.3 Tokens novos
| Token | Valor | Uso |
|---|---|---|
| `font-display` | `Permanent Marker` | só marca (13.2) |
| `wordmark`, `title-brand` | ver seção 4 | marca |
| `brand-yellow` | `#FACC15` (igual nos dois temas) | logo, fita, sticker amarelo |
| `ink` | `#18181B` (igual nos dois temas) | texto e borda **sobre amarelo/sticker**, independente do tema |
| `deco-primary` | alias de `primary` | spray, meio-tom |
| `sticker-border` | 2 px, `ink` | borda de tag/sticker |
| `sticker-shadow` | claro: `3px 3px 0 ink`; escuro: `3px 3px 0 brand-yellow` | sombra rígida do sticker |
| `tilt` | até 3 graus (sticker), até 7 graus (fita) | giro decorativo |

Todos os pares de texto da camada de marca passam AA: `ink` sobre `brand-yellow` 11,57:1; `ink` sobre `primary` claro 6,32:1; `ink` sobre `primary-soft` 15,46:1.

### 13.4 Assets (SVG leves, decorativos, `aria-hidden`)
Todos em `docs/design/assets/`: `logo-gopicos.svg` (marca, provisório do modelo do dono), `brand/spray-stroke.svg` (cor via `var(--gp-primary, #F97316)`, laranja como padrão), `brand/tape.svg`, `brand/halftone.svg` (cor via `currentColor`). Os de `brand/` têm menos de 2 KB cada; o logo tem ~4,2 KB (provisório). No mobile, usar `react-native-svg` (já necessário para ícones) com `color` vindo do token; **nada de PNG/JPEG de textura**. Dispensar `accessibilityLabel`: `accessibilityElementsHidden` / `importantForAccessibility="no-hide-descendants"`.

### 13.5 Componentes de marca
- **Wordmark**: logo + "GoPicos" em `wordmark` + spray `primary` abaixo (largura ~4x a altura do texto).
- **TitleBrand**: título de tela em `title-brand` + spray curto abaixo (largura ~3,2x o corpo). Cada tela tem **um** `TitleBrand`, que é o `h1`.
- **Tape** (fita): canto superior da tela, girada -5 a -7 graus, parcialmente fora da tela, texto decorativo curto (ex.: "GO SKATE").
- **Halftone**: canto superior direito (e, na web, também inferior esquerdo), opacidade 30 a 45%.
- **Sticker / Tag**: chip (`Street`, `Park`...) com fundo `brand-yellow` ou `primary-soft` (ou `surface`), borda `sticker-border`, sombra `sticker-shadow`, raio `sm`, rótulo Inter 14/600 em `ink`, giro opcional de até 3 graus. Continua sendo um chip funcional: alvo 44 mínimo se interativo, texto sempre legível.

### 13.6 Quando usar e quando NÃO usar
Usar: wordmark e título de tela de entrada; cantos e cabeçalhos de telas de entrada, vazio e onboarding; chips de modalidade e badges de destaque; ilustrações de estado vazio.
**Não usar:** em textos longos, parágrafos, campos de formulário, rótulos, botões, mensagens de erro/aviso/toast, nem em telas densas de uso (mapa, detalhe, lista) além do chip. **Nada atrás de texto** sem contraste AA (o spray fica **abaixo** do texto, nunca sob ele). Sem animação decorativa. Sem imagem raster.
Densidade: no máximo uma fita, um meio-tom e um spray por tela; elementos decorativos ficam **fora da área do formulário** (não podem cobrir campos nem aumentar a rolagem).

### 13.7 Desempenho e acessibilidade
- Fonte display única + SVGs (soma de assets de marca < 10 KB, logo incluído). Sem textura em imagem.
- Decoração fora da ordem de foco; `prefers-reduced-motion` irrelevante (estática).
- Escala de fonte do sistema: títulos em display aceitam até 1,3x sem quebrar o layout (quebram em duas linhas, spray acompanha a largura).
- Contraste AA em tudo que é texto e controle, nos dois temas.

### 13.8 Decisões da camada de marca
**D16. Fonte de grafite legível (Permanent Marker) e só em títulos.** Grafite autêntico (wildstyle) é ilegível; marcador mantém a cultura sem sacrificar leitura, e restringir a 24 px+ e a títulos garante AA e escaneabilidade. **D17. Sticker com borda e sombra rígida** reaproveita o chip funcional, em vez de criar um componente paralelo. **D18. Decoração só em vetor e nos cantos**, para custo zero de performance e nenhum risco aos formulários. **D19. `ink` fixo** (não muda com o tema) porque o amarelo e o laranja da marca são fixos e precisam sempre de texto escuro.

### 13.9 Mudanças da camada de marca para os devs
Novos: `font-display`, tokens `wordmark` e `title-brand`, `brand-yellow`, `ink`, `sticker-border`, `sticker-shadow`, componentes `Wordmark`, `TitleBrand`, `Tape`, `Halftone`, `Sticker/Tag`, assets SVG da seção 13.4 e a fonte Permanent Marker (web e mobile). Nada existente é renomeado.

### 13.10 Frames de referência (Figma)
Página "Autenticação v2" do arquivo do DS (login e cadastro em 3 passos, mobile e web, claro e escuro, com a camada de marca aplicada). Login: mobile claro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-2, mobile escuro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-93, web claro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-184, web escuro https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-324. Cadastro passo 1: https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-464, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-547, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-630, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-762. Passo 2 (erro de e-mail): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-894, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-976, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1058, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1189. Passo 3 (erro de senha e aceite): https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1320, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1416, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1512, https://www.figma.com/design/cFlDLcx1lxM6RouTMSrJQN/?node-id=20-1657. Observação: o glifo do skatista nestes frames é uma versão simplificada; o arquivo oficial é `docs/design/assets/logo-gopicos.svg`.
