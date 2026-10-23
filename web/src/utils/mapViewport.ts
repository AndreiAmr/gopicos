const KEY = 'gopicos.home.viewport';

export type MapViewport = { longitude: number; latitude: number; zoom: number };

let memory: MapViewport | null = null;

const isViewport = (value: unknown): value is MapViewport => {
  const v = value as Partial<MapViewport> | null;
  return (
    typeof v?.longitude === 'number' &&
    typeof v?.latitude === 'number' &&
    typeof v?.zoom === 'number'
  );
};

/** Guarda posição e zoom do mapa da Home para "Voltar ao mapa" (UX-F4). */
export const saveViewport = (viewport: MapViewport): void => {
  memory = viewport;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(viewport));
  } catch {
    // armazenamento indisponível: a memória do módulo basta durante a sessão da aba
  }
};

export const loadViewport = (): MapViewport | null => {
  if (memory) return memory;
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return isViewport(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
