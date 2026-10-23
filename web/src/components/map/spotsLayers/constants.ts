/** A partir deste zoom os polígonos aparecem; mais longe, só os pins (UX-P3). */
export const POLYGON_MIN_ZOOM = 15;

export const SPOT_INTERACTIVE_LAYERS = [
  'spots-fill',
  'spots-clusters',
  'spots-pin',
  'spots-pin-selected',
];

/** Cluster nativo do Mapbox (spec 11): raio em px e zoom a partir do qual todo pico aparece solto. */
export const CLUSTER_RADIUS = 50;
export const CLUSTER_MAX_ZOOM = 14;

export const CLUSTER_SOURCE_ID = 'spots-points';
