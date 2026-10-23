import {
  LngLat,
  addPoint,
  canContinue,
  draftShape,
  fromPolygon,
  movePoint,
  pointsCountText,
  toPolygon,
  undoPoint,
} from './polygonDraft';

const a: LngLat = [-46.65, -23.55];
const b: LngLat = [-46.64, -23.55];
const c: LngLat = [-46.64, -23.56];

describe('polygonDraft', () => {
  it('adiciona, desfaz e move pontos sem mutar a lista', () => {
    const one = addPoint([], a);
    const two = addPoint(one, b);
    expect(two).toEqual([a, b]);
    expect(one).toEqual([a]);
    expect(undoPoint(two)).toEqual([a]);
    expect(undoPoint([])).toEqual([]);
    expect(movePoint(two, 1, c)).toEqual([a, c]);
  });

  it('Continuar só com 3 ou mais pontos', () => {
    expect(canContinue([a, b])).toBe(false);
    expect(canContinue([a, b, c])).toBe(true);
    expect(pointsCountText(2)).toBe('Marque pelo menos 3 pontos');
    expect(pointsCountText(4)).toBe('4 pontos');
  });

  it('gera GeoJSON fechado em [lng, lat] e volta', () => {
    const polygon = toPolygon([a, b, c]);
    expect(polygon).toEqual({ type: 'Polygon', coordinates: [[a, b, c, a]] });
    expect(toPolygon([a, b])).toBeNull();
    expect(fromPolygon(polygon)).toEqual([a, b, c]);
    expect(fromPolygon(null)).toEqual([]);
  });

  it('forma de desenho: nada, linha ou polígono', () => {
    expect(draftShape([a])).toBeNull();
    expect(draftShape([a, b])?.geometry.type).toBe('LineString');
    expect(draftShape([a, b, c])?.geometry.type).toBe('Polygon');
  });
});
