import { formatAverage, starLabel } from '../../atomic/ds/atoms/StarRating/logic';

/** Pico como a listagem (`getAllSpots`) devolve. */
export type SpotSummary = {
  id: string;
  name: string;
  modality: string;
  images?: string[] | null;
  /** GeoJSON Polygon em ordem [lng, lat]. */
  coordinates: {
    type: 'Polygon';
    coordinates: number[][][];
  } | null;
  ratingAverage: number | null;
  reviewsCount: number;
};

export const MODALITY_LABELS: Record<string, string> = {
  street: 'Street',
  park: 'Park',
  bowl_pool: 'Bowl/Pool',
  vertical: 'Vertical',
  downhill: 'Downhill',
  mixed: 'Mista',
};

export const modalityLabel = (modality: string): string =>
  MODALITY_LABELS[modality] ?? modality;

/** Texto curto do pin: "★ 4,6" ou "Novo" quando não há avaliações. */
export const pinText = (spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>): string =>
  spot.reviewsCount > 0 && spot.ratingAverage != null
    ? `★ ${spot.ratingAverage.toFixed(1).replace('.', ',')}`
    : 'Novo';

const ratingSentence = (
  spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>,
): string =>
  spot.reviewsCount > 0 && spot.ratingAverage != null
    ? `nota ${spot.ratingAverage.toFixed(1).replace('.', ',')}, ${spot.reviewsCount} avaliações`
    : 'sem avaliações';

/** Rótulo de acessibilidade do pin: "{nome}, nota {média}, {n} avaliações". */
export const pinA11yLabel = (spot: SpotSummary): string =>
  `${spot.name}, ${ratingSentence(spot)}`;

/** Rótulo de acessibilidade do card: "{nome}, {modalidade}, nota {média}, {n} avaliações". */
export const cardA11yLabel = (spot: SpotSummary): string =>
  `${spot.name}, ${modalityLabel(spot.modality)}, ${ratingSentence(spot)}`;

/** "4,6 (23)" ou "Sem avaliações". */
export const ratingText = (
  spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>,
): string =>
  formatAverage(spot.ratingAverage ?? 0, spot.reviewsCount, 'Sem avaliações');

export { starLabel };

/** Centro do polígono (média dos vértices, ignorando o ponto de fechamento) em [lng, lat]. */
export const polygonCenter = (
  coordinates: SpotSummary['coordinates'],
): [number, number] | null => {
  const ring = coordinates?.coordinates?.[0];
  if (!ring || ring.length < 3) {
    return null;
  }

  const points = ring.slice(0, -1);
  const lng = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const lat = points.reduce((sum, p) => sum + p[1], 0) / points.length;

  return [lng, lat];
};

/** Spots com polígono válido, prontos para desenhar. */
export const drawableSpots = (spots: SpotSummary[]): SpotSummary[] =>
  spots.filter(spot => polygonCenter(spot.coordinates) !== null);

/** FeatureCollection de polígonos; `selected` marca o pico realçado. */
export const buildPolygonCollection = (
  spots: SpotSummary[],
  selectedId: string | null,
) => ({
  type: 'FeatureCollection' as const,
  features: drawableSpots(spots).map(spot => ({
    type: 'Feature' as const,
    id: spot.id,
    properties: { id: spot.id, selected: spot.id === selectedId },
    geometry: spot.coordinates as NonNullable<SpotSummary['coordinates']>,
  })),
});

const EARTH_RADIUS_KM = 6371;

/** Distância em km entre dois pontos [lng, lat] (haversine). */
export const distanceKm = (
  a: [number, number],
  b: [number, number],
): number => {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b[1] - a[1]);
  const dLng = rad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/** "A 1,2 km de você" (ou "A 350 m de você" abaixo de 1 km). */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `A ${Math.max(Math.round(km * 10) * 100, 100)} m de você`;
  }
  return `A ${km.toFixed(1).replace('.', ',')} km de você`;
};
