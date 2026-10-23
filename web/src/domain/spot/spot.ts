import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';

/** Coordenadas como o backend devolve: GeoJSON Polygon (ou, em dados antigos, só os anéis). */
export type SpotCoordinates =
  | { type: 'Polygon'; coordinates: number[][][] }
  | number[][][]
  | null
  | undefined;

export type SpotSummary = {
  id: string;
  name: string;
  modality: string;
  images?: (string | null)[] | null;
  coordinates: SpotCoordinates;
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

/** Anel externo do polígono, qualquer que seja o formato recebido. */
export const polygonRing = (coordinates: SpotCoordinates): number[][] | null => {
  const rings = Array.isArray(coordinates)
    ? coordinates
    : coordinates?.coordinates;
  const ring = rings?.[0];
  if (!Array.isArray(ring) || ring.length < 3) return null;
  return ring;
};

/** Centro do polígono (média dos vértices, sem o ponto de fechamento) em [lng, lat]. */
export const polygonCenter = (
  coordinates: SpotCoordinates,
): [number, number] | null => {
  const ring = polygonRing(coordinates);
  if (!ring) return null;
  const points = ring.slice(0, -1);
  if (points.length === 0) return null;
  const lng = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const lat = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  return [lng, lat];
};

/** Picos com polígono válido, prontos para desenhar. */
export const drawableSpots = <T extends Pick<SpotSummary, 'coordinates'>>(
  spots: T[],
): T[] => spots.filter((spot) => polygonCenter(spot.coordinates) !== null);

const formatDecimal = (value: number) =>
  value.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const hasRating = (spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>) =>
  spot.reviewsCount > 0 && spot.ratingAverage != null;

/** Texto do pin: "★ 4,6" ou "Novo" quando não há avaliações. */
export const pinText = (
  spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>,
): string =>
  hasRating(spot) ? `★ ${formatDecimal(spot.ratingAverage as number)}` : 'Novo';

/** Contagem exibida: acima de 999 vira "999+". */
export const formatCount = (count: number): string =>
  count > 999 ? '999+' : String(count);

/** "4,6 (23)" ou "Sem avaliações". */
export const ratingText = (
  spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>,
): string =>
  hasRating(spot)
    ? `${formatDecimal(spot.ratingAverage as number)} (${formatCount(spot.reviewsCount)})`
    : 'Sem avaliações';

const ratingSentence = (
  spot: Pick<SpotSummary, 'ratingAverage' | 'reviewsCount'>,
): string =>
  hasRating(spot)
    ? `nota ${formatDecimal(spot.ratingAverage as number)} de 5, ${spot.reviewsCount} ${
        spot.reviewsCount === 1 ? 'avaliação' : 'avaliações'
      }`
    : 'sem avaliações';

/** Rótulo de acessibilidade do pin: "{Nome}, nota 4,6 de 5, 23 avaliações". */
export const pinA11yLabel = (spot: SpotSummary): string =>
  `${spot.name}, ${ratingSentence(spot)}`;

/** Rótulo de acessibilidade do card: "{nome}, {modalidade}, nota 4,6 de 5, 23 avaliações". */
export const cardA11yLabel = (spot: SpotSummary): string =>
  `${spot.name}, ${modalityLabel(spot.modality)}, ${ratingSentence(spot)}`;

/** Rótulo de acessibilidade do cluster. */
export const clusterA11yLabel = (count: number): string =>
  `${count} picos nesta área, clique para aproximar`;

/** FeatureCollection de pontos (um por pico) usada pelo pin e pelo cluster. */
export const buildPointCollection = (
  spots: SpotSummary[],
  selectedId?: string | null,
): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features: drawableSpots(spots).map((spot): Feature<Point> => {
    const center = polygonCenter(spot.coordinates) as [number, number];
    return {
      type: 'Feature',
      properties: {
        id: spot.id,
        label: pinText(spot),
        selected: spot.id === selectedId,
      },
      geometry: { type: 'Point', coordinates: center },
    };
  }),
});

/** FeatureCollection de polígonos; `selected` marca o pico realçado. */
export const buildPolygonCollection = (
  spots: SpotSummary[],
  selectedId?: string | null,
): FeatureCollection<Polygon> => ({
  type: 'FeatureCollection',
  features: drawableSpots(spots).map((spot): Feature<Polygon> => {
    const ring = polygonRing(spot.coordinates) as number[][];
    return {
      type: 'Feature',
      properties: { id: spot.id, selected: spot.id === selectedId },
      geometry: { type: 'Polygon', coordinates: [ring] },
    };
  }),
});

/** Distância em km entre duas posições [lng, lat] (haversine). */
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
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

/** "A 1,2 km de você" / "A 350 m de você". */
export const formatDistance = (km: number): string =>
  km < 1
    ? `A ${Math.round(km * 1000)} m de você`
    : `A ${km.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km de você`;
