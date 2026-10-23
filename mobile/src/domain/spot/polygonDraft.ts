/** Ponto [lng, lat] do polígono em edição. */
export type LngLat = [number, number];

export const MIN_POLYGON_POINTS = 3;

export const addPoint = (points: LngLat[], point: LngLat): LngLat[] => [
  ...points,
  [point[0], point[1]],
];

export const undoPoint = (points: LngLat[]): LngLat[] => points.slice(0, -1);

export const movePoint = (
  points: LngLat[],
  index: number,
  point: LngLat,
): LngLat[] =>
  points.map((current, i) => (i === index ? [point[0], point[1]] : current));

export const canContinue = (points: LngLat[]): boolean =>
  points.length >= MIN_POLYGON_POINTS;

/** "Marque pelo menos 3 pontos" ou "{n} pontos". */
export const pointsCountText = (count: number): string => {
  if (count < MIN_POLYGON_POINTS) return 'Marque pelo menos 3 pontos';
  return `${count} pontos`;
};

/** GeoJSON Polygon fechado (repete o primeiro ponto no fim), ordem [lng, lat]. */
export const toPolygon = (points: LngLat[]) => {
  if (!canContinue(points)) return null;

  return {
    type: 'Polygon' as const,
    coordinates: [[...points, points[0]].map(p => [p[0], p[1]])],
  };
};

/** Pontos de volta a partir do polígono fechado (para "Alterar local"). */
export const fromPolygon = (
  polygon: { coordinates: number[][][] } | null | undefined,
): LngLat[] => {
  const ring = polygon?.coordinates?.[0] ?? [];
  const open = ring.length > 1 ? ring.slice(0, -1) : ring;
  return open.map(p => [p[0], p[1]]);
};

/**
 * Forma para desenhar enquanto edita: com 3+ pontos é o polígono fechado;
 * com 2 é uma linha; com menos, nada.
 */
export const draftShape = (points: LngLat[]) => {
  if (points.length >= MIN_POLYGON_POINTS) {
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: toPolygon(points)!,
    };
  }
  if (points.length === 2) {
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: points },
    };
  }
  return null;
};
