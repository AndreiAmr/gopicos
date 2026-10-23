/**
 * Camadas do mapa (spec home.md seções 6.5 e 12, GP-048). As três usam o
 * Mapbox Standard; a troca é só de configuração, exceto o satélite.
 */
export type MapLayer = 'street' | 'satellite' | 'concrete';

export const DEFAULT_MAP_LAYER: MapLayer = 'street';

/** `map-style.*` (spec seção 11): ids dos estilos do Mapbox. */
export const MAP_STYLE_URL = {
  standard: 'mapbox://styles/mapbox/standard',
  satellite: 'mapbox://styles/mapbox/standard-satellite',
} as const;

export type MapLayerOption = {
  value: MapLayer;
  label: string;
  description: string;
};

export const MAP_LAYER_OPTIONS: MapLayerOption[] = [
  { value: 'street', label: 'Rua', description: 'Ruas e nomes' },
  { value: 'satellite', label: 'Satélite', description: 'Foto aérea com ruas' },
  {
    value: 'concrete',
    label: 'Concreto',
    description: 'Mapa cinza, picos em destaque',
  },
];

export const layerStrings = {
  title: 'Camadas',
  group: 'Tipo de mapa',
  close: 'Fechar camadas',
  satelliteError: 'Não foi possível carregar o mapa de satélite.',
  styleError: 'Não foi possível carregar o mapa.',
} as const;

export const layerLabel = (layer: MapLayer): string =>
  MAP_LAYER_OPTIONS.find(option => option.value === layer)?.label ?? 'Rua';

/** "Camadas do mapa, atual: Rua". */
export const layersButtonLabel = (layer: MapLayer): string =>
  `Camadas do mapa, atual: ${layerLabel(layer)}`;

export type ColorScheme = 'light' | 'dark';

export type MapStyle = {
  styleURL: string;
  /** Config do import `basemap` do Standard (StyleImport). */
  config: {
    lightPreset: 'day' | 'night';
    theme?: 'default' | 'monochrome';
  };
};

/**
 * Estilo de cada camada: Rua segue o tema do app (dia/noite, D1), Concreto é o
 * Standard monocromático e Satélite é o Standard Satellite.
 */
export const mapStyleFor = (layer: MapLayer, scheme: ColorScheme): MapStyle => {
  const lightPreset = scheme === 'dark' ? 'night' : 'day';
  if (layer === 'satellite') {
    return { styleURL: MAP_STYLE_URL.satellite, config: { lightPreset } };
  }
  return {
    styleURL: MAP_STYLE_URL.standard,
    config: {
      lightPreset,
      theme: layer === 'concrete' ? 'monochrome' : 'default',
    },
  };
};

export const isMapLayer = (value: unknown): value is MapLayer =>
  value === 'street' || value === 'satellite' || value === 'concrete';

/** Valor salvo no aparelho; qualquer coisa inválida volta para Rua. */
export const parseStoredLayer = (raw: string | null | undefined): MapLayer =>
  isMapLayer(raw) ? raw : DEFAULT_MAP_LAYER;
