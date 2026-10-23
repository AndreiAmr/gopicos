import { describe, expect, it } from 'vitest';
import {
  buildPointCollection,
  buildPolygonCollection,
  clusterA11yLabel,
  distanceKm,
  drawableSpots,
  formatCount,
  formatDistance,
  pinA11yLabel,
  pinText,
  polygonCenter,
  ratingText,
  type SpotSummary,
} from './spot';

const ring = [
  [0, 0],
  [0, 2],
  [2, 2],
  [2, 0],
  [0, 0],
];

const spot = (overrides: Partial<SpotSummary> = {}): SpotSummary => ({
  id: '1',
  name: 'Praça',
  modality: 'street',
  coordinates: { type: 'Polygon', coordinates: [ring] },
  ratingAverage: 4.6,
  reviewsCount: 23,
  ...overrides,
});

describe('domain/spot', () => {
  it('calcula o centro do polígono nos dois formatos de coordenadas', () => {
    expect(polygonCenter({ type: 'Polygon', coordinates: [ring] })).toEqual([
      1, 1,
    ]);
    expect(polygonCenter([ring])).toEqual([1, 1]);
    expect(polygonCenter(null)).toBeNull();
    expect(polygonCenter([[[0, 0]]])).toBeNull();
  });

  it('descarta picos sem polígono válido', () => {
    expect(drawableSpots([spot(), spot({ id: '2', coordinates: null })])).toHaveLength(1);
  });

  it('formata o pin com nota ou "Novo"', () => {
    expect(pinText(spot())).toBe('★ 4,6');
    expect(pinText(spot({ ratingAverage: 5, reviewsCount: 1 }))).toBe('★ 5,0');
    expect(pinText(spot({ ratingAverage: null, reviewsCount: 0 }))).toBe('Novo');
  });

  it('formata nota e contagem do resumo', () => {
    expect(ratingText(spot())).toBe('4,6 (23)');
    expect(ratingText(spot({ reviewsCount: 1500 }))).toBe('4,6 (999+)');
    expect(ratingText(spot({ ratingAverage: null, reviewsCount: 0 }))).toBe(
      'Sem avaliações',
    );
    expect(formatCount(999)).toBe('999');
    expect(formatCount(1000)).toBe('999+');
  });

  it('monta os rótulos de acessibilidade', () => {
    expect(pinA11yLabel(spot())).toBe('Praça, nota 4,6 de 5, 23 avaliações');
    expect(pinA11yLabel(spot({ ratingAverage: null, reviewsCount: 0 }))).toBe(
      'Praça, sem avaliações',
    );
    expect(clusterA11yLabel(7)).toBe('7 picos nesta área, clique para aproximar');
  });

  it('monta as coleções de pontos e polígonos marcando o selecionado', () => {
    const points = buildPointCollection([spot()], '1');
    expect(points.features[0].properties).toMatchObject({
      id: '1',
      label: '★ 4,6',
      selected: true,
    });
    const polygons = buildPolygonCollection([spot(), spot({ id: '2', coordinates: null })], null);
    expect(polygons.features).toHaveLength(1);
    expect(polygons.features[0].properties?.selected).toBe(false);
  });

  it('calcula e formata distâncias', () => {
    expect(distanceKm([0, 0], [0, 0])).toBe(0);
    expect(formatDistance(0.35)).toBe('A 350 m de você');
    expect(formatDistance(1.234)).toBe('A 1,2 km de você');
  });
});
