/**
 * Zonas reservadas da Home (spec home.md seção 4). Valores em px, no
 * referencial da tela do mapa (topo = topo da tela; base = topo da tab bar).
 */
export const GUTTER = 16;
export const CONTROL_SIZE = 48;
/** Coluna Z2: dois botões de 48 com 8 entre eles. */
export const COLUMN_HEIGHT = CONTROL_SIZE * 2 + 8;
/** Distância da coluna até o que estiver embaixo (tab bar ou sheet). */
export const COLUMN_GAP = 16;
/** Z3: logo do Mapbox 8 acima da base; ~20 de altura. */
export const ORNAMENT_GAP = 8;
export const ORNAMENT_HEIGHT = 20;
/** Z4: toast com até 3 linhas. */
export const TOAST_MAX_HEIGHT = 96;
/** Largura reservada à direita do toast: gutter + coluna + 8. */
export const TOAST_RIGHT = GUTTER + CONTROL_SIZE + 8;

/**
 * A coluna cabe entre o fim do topo (Z1) e o topo do sheet/tab bar?
 * Se não couber inteira, some (nunca fica parcialmente coberta, 4.2).
 */
export const columnFits = (z1Bottom: number, base: number): boolean => {
  'worklet';
  return base - COLUMN_GAP - COLUMN_HEIGHT >= z1Bottom + COLUMN_GAP;
};

/** Distância da base do mapa até o topo do sheet aberto (0 sem sheet). */
export const sheetOverlap = (mapHeight: number, sheetTop: number): number => {
  'worklet';
  return Math.max(0, mapHeight - sheetTop);
};

export type ToastZone =
  | { position: 'top' }
  | { position: 'bottom'; bottom: number; left: number; right: number };

/**
 * Z4: embaixo, à esquerda da coluna, 8 acima do logo do Mapbox. Sem espaço
 * acima do sheet (ou com sheet modal), vai para o topo da safe area.
 */
export const toastZone = ({
  tabBarHeight,
  overlap,
  mapHeight,
  z1Bottom,
  modalOpen,
}: {
  tabBarHeight: number;
  overlap: number;
  mapHeight: number;
  z1Bottom: number;
  modalOpen: boolean;
}): ToastZone => {
  const fromMapBottom = overlap + ORNAMENT_GAP + ORNAMENT_HEIGHT + 8;
  const toastTop = mapHeight - fromMapBottom - TOAST_MAX_HEIGHT;
  if (modalOpen || toastTop < z1Bottom) {
    return { position: 'top' };
  }
  return {
    position: 'bottom',
    bottom: tabBarHeight + fromMapBottom,
    left: GUTTER,
    right: TOAST_RIGHT,
  };
};
