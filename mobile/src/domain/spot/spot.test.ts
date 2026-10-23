import {
  SpotSummary,
  buildPointCollection,
  buildPolygonCollection,
  clusterA11yLabel,
  pickPressTarget,
  cardA11yLabel,
  distanceKm,
  drawableSpots,
  formatDistance,
  modalityLabel,
  pinA11yLabel,
  pinText,
  polygonCenter,
  ratingText,
} from './spot';

const square = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [-46.66, -23.56],
      [-46.64, -23.56],
      [-46.64, -23.54],
      [-46.66, -23.54],
      [-46.66, -23.56],
    ],
  ],
};

const spot = (over: Partial<SpotSummary> = {}): SpotSummary => ({
  id: '1',
  name: 'Pico da Paulista',
  modality: 'bowl_pool',
  coordinates: square,
  ratingAverage: 4.6,
  reviewsCount: 23,
  ...over,
});

describe('spot domain', () => {
  it('pin mostra a nota ou "Novo"', () => {
    expect(pinText(spot())).toBe('★ 4,6');
    expect(pinText(spot({ ratingAverage: null, reviewsCount: 0 }))).toBe('Novo');
  });

  it('rótulos de acessibilidade trazem nota e contagem', () => {
    expect(pinA11yLabel(spot())).toBe('Pico da Paulista, nota 4,6, 23 avaliações');
    expect(cardA11yLabel(spot())).toBe(
      'Pico da Paulista, Bowl/Pool, nota 4,6, 23 avaliações',
    );
    expect(cardA11yLabel(spot({ reviewsCount: 0, ratingAverage: null }))).toBe(
      'Pico da Paulista, Bowl/Pool, sem avaliações',
    );
  });

  it('texto de nota: "4,6 (23)" ou "Sem avaliações"', () => {
    expect(ratingText(spot())).toBe('4,6 (23)');
    expect(ratingText(spot({ reviewsCount: 0, ratingAverage: null }))).toBe(
      'Sem avaliações',
    );
  });

  it('modalidade desconhecida volta como veio', () => {
    expect(modalityLabel('mixed')).toBe('Mista');
    expect(modalityLabel('x')).toBe('x');
  });

  it('calcula o centro em [lng, lat]', () => {
    const [lng, lat] = polygonCenter(square)!;
    expect(lng).toBeCloseTo(-46.65);
    expect(lat).toBeCloseTo(-23.55);
    expect(polygonCenter(null)).toBeNull();
  });

  it('ignora picos sem polígono válido ao desenhar', () => {
    const list = [spot(), spot({ id: '2', coordinates: null })];
    expect(drawableSpots(list)).toHaveLength(1);
    const collection = buildPolygonCollection(list, '1');
    expect(collection.features).toHaveLength(1);
    expect(collection.features[0].properties).toEqual({
      id: '1',
      selected: true,
    });
  });

  it('formata distância', () => {
    const km = distanceKm([-46.65, -23.55], [-46.65, -23.56]);
    expect(km).toBeGreaterThan(1);
    expect(km).toBeLessThan(1.3);
    expect(formatDistance(1.234)).toBe('A 1,2 km de você');
    expect(formatDistance(0.35)).toBe('A 400 m de você');
  });
});

describe('cluster de pins', () => {
  it('monta pontos com o rótulo e deixa o pico selecionado de fora', () => {
    const spots = [spot(), spot({ id: '2', ratingAverage: null, reviewsCount: 0 })];

    const all = buildPointCollection(spots);
    expect(all.features.map(f => f.properties)).toEqual([
      { id: '1', label: '★ 4,6' },
      { id: '2', label: 'Novo' },
    ]);
    expect(all.features[0].geometry.coordinates[0]).toBeCloseTo(-46.65);
    expect(all.features[0].geometry.coordinates[1]).toBeCloseTo(-23.55);

    expect(buildPointCollection(spots, '1').features.map(f => f.properties.id)).toEqual(['2']);
  });

  it('rotula o cluster para acessibilidade', () => {
    expect(clusterA11yLabel(7)).toBe('7 picos nesta área, toque para aproximar');
  });

  it('identifica o alvo do toque: cluster, pico ou vazio', () => {
    const cluster = {
      properties: { cluster: true, cluster_id: 3, point_count: 5 },
      geometry: { coordinates: [-46.6, -23.5] },
    };
    expect(pickPressTarget([cluster])).toEqual({
      kind: 'cluster',
      feature: cluster,
      center: [-46.6, -23.5],
    });
    expect(pickPressTarget([{ properties: { id: 's1' } }])).toEqual({
      kind: 'spot',
      id: 's1',
    });
    expect(pickPressTarget([])).toEqual({ kind: 'none' });
    expect(pickPressTarget(undefined)).toEqual({ kind: 'none' });
  });
});
