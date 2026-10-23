import type { SpotSummary } from '../spot/spot';

/** Área visível do mapa em [lng, lat] (cantos nordeste e sudoeste). */
export type MapBounds = {
  ne: [number, number];
  sw: [number, number];
};

type Box = { minLng: number; maxLng: number; minLat: number; maxLat: number };

const polygonBox = (coordinates: SpotSummary['coordinates']): Box | null => {
  const ring = coordinates?.coordinates?.[0];
  if (!ring || ring.length < 3) {
    return null;
  }
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return { minLng, maxLng, minLat, maxLat };
};

const boundsBoxes = (bounds: MapBounds): Box[] => {
  const [east, north] = bounds.ne;
  const [west, south] = bounds.sw;
  const minLat = Math.min(north, south);
  const maxLat = Math.max(north, south);
  // Área cruzando o antimeridiano (oeste > leste): duas faixas.
  if (west > east) {
    return [
      { minLng: west, maxLng: 180, minLat, maxLat },
      { minLng: -180, maxLng: east, minLat, maxLat },
    ];
  }
  return [{ minLng: west, maxLng: east, minLat, maxLat }];
};

const overlaps = (a: Box, b: Box) =>
  a.minLng <= b.maxLng &&
  a.maxLng >= b.minLng &&
  a.minLat <= b.maxLat &&
  a.maxLat >= b.minLat;

/**
 * O polígono "toca" a área visível (spec home.md 6.1). Usa a caixa envolvente
 * do polígono: picos são pequenos, a diferença para o polígono exato é
 * desprezível na escala da tela.
 */
export const spotInBounds = (
  spot: Pick<SpotSummary, 'coordinates'>,
  bounds: MapBounds,
): boolean => {
  const box = polygonBox(spot.coordinates);
  return box !== null && boundsBoxes(bounds).some(area => overlaps(box, area));
};

/** Quantos picos estão na área; sem área conhecida ainda, `null`. */
export const countInArea = (
  spots: Array<Pick<SpotSummary, 'coordinates'>>,
  bounds: MapBounds | null,
): number | null =>
  bounds ? spots.filter(spot => spotInBounds(spot, bounds)).length : null;

/** Caixa que envolve todos os picos (para enquadrar o mapa sem localização). */
export const spotsBounds = (
  spots: Array<Pick<SpotSummary, 'coordinates'>>,
): MapBounds | null => {
  const boxes = spots
    .map(spot => polygonBox(spot.coordinates))
    .filter((box): box is Box => box !== null);
  if (boxes.length === 0) {
    return null;
  }
  return {
    ne: [
      Math.max(...boxes.map(box => box.maxLng)),
      Math.max(...boxes.map(box => box.maxLat)),
    ],
    sw: [
      Math.min(...boxes.map(box => box.minLng)),
      Math.min(...boxes.map(box => box.minLat)),
    ],
  };
};

/** [lng, lat] com dois números finitos (o SDK rejeita NaN, null e listas). */
export const isValidCoordinate = (value: unknown): value is [number, number] =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number' &&
  Number.isFinite(value[0]) &&
  Number.isFinite(value[1]);
