/**
 * Tokens do GoPicos Design System (docs/design/design-system.md).
 * Fonte única de valores do mobile: cores viram chaves de tema do Tamagui
 * (`$bg`, `$surface`, `$primary`...) e o restante é consumido como constante.
 *
 * Os tokens de espaço/raio/tamanho NÃO sobrescrevem os do Tamagui (`$4`, `$md`),
 * porque as telas atuais dependem dos valores padrão; a troca é feita no GP-005.
 */

export const gpColors = {
  light: {
    bg: '#F6F5F2',
    surface: '#FFFFFF',
    sunken: '#ECEAE5',
    text: '#17171A',
    textMuted: '#585861',
    textSubtle: '#64646E',
    border: '#8A8A93',
    divider: '#DEDCD6',
    primary: '#B93C08',
    primaryHover: '#9A3206',
    onPrimary: '#FFFFFF',
    primarySoft: '#FDE8DC',
    primaryText: '#9A3206',
    star: '#C77700',
    success: '#146C35',
    error: '#B3201F',
    warning: '#8F5200',
    info: '#1D4ED8',
    focus: '#1D4ED8',
  },
  dark: {
    bg: '#0F0F11',
    surface: '#1A1A1E',
    sunken: '#09090A',
    text: '#F5F5F6',
    textMuted: '#B0B0B9',
    textSubtle: '#9A9AA4',
    border: '#82828C',
    divider: '#2E2E34',
    primary: '#FF8A4C',
    primaryHover: '#FFA070',
    onPrimary: '#1A0B02',
    primarySoft: '#3A1D0C',
    primaryText: '#FFA070',
    star: '#FBBF24',
    success: '#4ADE80',
    error: '#FF8A80',
    warning: '#FBBF24',
    info: '#7FA8FF',
    focus: '#7FA8FF',
  },
} as const;

export type GpColorName = keyof typeof gpColors.light;

/** Cores fixas (iguais nos dois modos) para polígonos do mapa. */
export const mapColors = {
  spotFill: 'rgba(185, 60, 8, 0.25)',
  spotStroke: '#B93C08',
  spotSelected: '#1D4ED8',
  pinSurface: '#FFFFFF',
  pinBorder: '#7D858C',
  pinText: '#18181B',
  /** Cluster: `primary`, texto `on-primary` e borda escura (spec 11). */
  clusterFill: '#F97316',
  clusterText: '#18181B',
  clusterStroke: '#18181B',
} as const;

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

/** Alvo de toque mínimo (48) e tamanhos de controle. */
export const size = {
  touch: 48,
  controlLg: 48,
  controlMd: 44,
} as const;

export const zIndex = {
  map: 0,
  mapControls: 10,
  header: 20,
  sheet: 40,
  toast: 60,
} as const;

export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

/** Nomes de fonte (Inter) registrados no iOS/Android. */
export const fontFamily = {
  regular: 'Inter18pt-Regular',
  medium: 'Inter18pt-Medium',
  semiBold: 'Inter18pt-SemiBold',
  bold: 'Inter18pt-Bold',
} as const;

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyStrong'
  | 'bodySm'
  | 'label'
  | 'button'
  | 'caption';

export const typography: Record<
  TypographyVariant,
  { fontSize: number; lineHeight: number; fontFamily: string }
> = {
  display: { fontSize: 32, lineHeight: 38, fontFamily: fontFamily.bold },
  h1: { fontSize: 26, lineHeight: 32, fontFamily: fontFamily.bold },
  h2: { fontSize: 20, lineHeight: 26, fontFamily: fontFamily.semiBold },
  h3: { fontSize: 17, lineHeight: 24, fontFamily: fontFamily.semiBold },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fontFamily.regular },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontFamily: fontFamily.semiBold },
  bodySm: { fontSize: 14, lineHeight: 20, fontFamily: fontFamily.regular },
  label: { fontSize: 14, lineHeight: 20, fontFamily: fontFamily.semiBold },
  button: { fontSize: 16, lineHeight: 20, fontFamily: fontFamily.semiBold },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: fontFamily.medium },
};

/** Escala máxima de fonte do sistema (DS seção 4). */
export const MAX_FONT_SCALE = 1.3;

/**
 * Elevação: iOS usa shadow*, Android usa `elevation` (1/4/8 para os níveis 1/2/3).
 * No escuro a elevação vem de `surface` + borda; a sombra quase some.
 */
export const elevation = {
  1: {
    shadowColor: '#17171A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: '#17171A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  3: {
    shadowColor: '#17171A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;
