import {
  Place,
  cameraTarget,
  canSearch,
  limitPlaces,
  placeContext,
  placeFieldText,
  placeTitle,
  shouldShowHint,
} from './place';

const place = (over: Partial<Place> = {}): Place => ({
  name: 'Avenida Paulista, Bela Vista, São Paulo',
  lat: -23.56,
  lng: -46.65,
  road: 'Avenida Paulista',
  district: null,
  suburb: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  boundingBox: [-23.57, -23.55, -46.66, -46.64],
  ...over,
});

describe('domain/place', () => {
  it('só busca a partir de 3 letras e mostra dica com 1 a 2', () => {
    expect(canSearch('ab')).toBe(false);
    expect(canSearch(' abc ')).toBe(true);
    expect(shouldShowHint('')).toBe(false);
    expect(shouldShowHint('a')).toBe(true);
    expect(shouldShowHint('abc')).toBe(false);
  });

  it('limita a 5 resultados com coordenadas', () => {
    const many = Array.from({ length: 8 }, (_, i) => place({ name: `p${i}` }));
    expect(limitPlaces(many)).toHaveLength(5);
    expect(limitPlaces([null, place({ lat: null })])).toEqual([]);
    expect(limitPlaces(null)).toEqual([]);
  });

  it('monta título e contexto sem repetir', () => {
    expect(placeTitle(place())).toBe('Avenida Paulista');
    expect(placeContext(place())).toBe('Bela Vista, São Paulo, SP');
    expect(placeTitle(place({ road: null }))).toContain('Avenida Paulista');
    expect(placeContext(place({ road: null, name: 'São Paulo', suburb: null }))).toBe('SP');
    expect(placeFieldText(place())).toContain('Bela Vista');
  });

  it('usa os limites quando existem, senão o centro', () => {
    expect(cameraTarget(place())).toEqual({
      type: 'bounds',
      ne: [-46.64, -23.55],
      sw: [-46.66, -23.57],
    });
    expect(cameraTarget(place({ boundingBox: null }))).toEqual({
      type: 'center',
      center: [-46.65, -23.56],
      zoom: 14,
    });
    expect(cameraTarget(place({ lat: null }))).toBeNull();
  });
});
