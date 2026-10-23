import { countInArea, isValidCoordinate, spotInBounds, spotsBounds } from './area';
import {
  DEFAULT_MAP_LAYER,
  layersButtonLabel,
  mapStyleFor,
  parseStoredLayer,
} from './layers';
import {
  INITIAL_LOCATION,
  LocationEvent,
  LocationState,
  locationA11yLabel,
  locationButtonAction,
  locationReducer,
} from './location';

const square = (lng: number, lat: number, d = 0.001) => ({
  coordinates: {
    type: 'Polygon' as const,
    coordinates: [
      [
        [lng - d, lat - d],
        [lng + d, lat - d],
        [lng + d, lat + d],
        [lng - d, lat + d],
        [lng - d, lat - d],
      ],
    ],
  },
});

const paulista = { ne: [-46.64, -23.55] as [number, number], sw: [-46.67, -23.57] as [number, number] };

describe('domain/map/area', () => {
  it('conta os picos cujo polígono toca a área visível', () => {
    const inside = square(-46.655, -23.56);
    const touching = square(-46.6395, -23.56); // borda leste encosta na área
    const outside = square(-46.6, -23.56);
    expect(spotInBounds(inside, paulista)).toBe(true);
    expect(spotInBounds(touching, paulista)).toBe(true);
    expect(spotInBounds(outside, paulista)).toBe(false);
    expect(countInArea([inside, touching, outside], paulista)).toBe(2);
  });

  it('sem área conhecida a contagem é null; polígono inválido não conta', () => {
    expect(countInArea([square(0, 0)], null)).toBeNull();
    expect(countInArea([{ coordinates: null }], paulista)).toBe(0);
  });

  it('trata área que cruza o antimeridiano', () => {
    const bounds = { ne: [-170, 10] as [number, number], sw: [170, -10] as [number, number] };
    expect(spotInBounds(square(175, 0), bounds)).toBe(true);
    expect(spotInBounds(square(-175, 0), bounds)).toBe(true);
    expect(spotInBounds(square(0, 0), bounds)).toBe(false);
  });

  it('enquadra todos os picos e valida coordenadas', () => {
    expect(spotsBounds([])).toBeNull();
    const box = spotsBounds([square(-46.6, -23.5), square(-46.7, -23.6)]);
    expect(box?.ne[0]).toBeCloseTo(-46.599);
    expect(box?.sw[1]).toBeCloseTo(-23.601);
    expect(isValidCoordinate([1, 2])).toBe(true);
    expect(isValidCoordinate([NaN, 2])).toBe(false);
    expect(isValidCoordinate([undefined, 2])).toBe(false);
    expect(isValidCoordinate([[1, 2]])).toBe(false);
  });
});

describe('domain/map/layers', () => {
  it('Rua segue o tema; Concreto é monocromático; Satélite usa outro estilo', () => {
    expect(mapStyleFor('street', 'light')).toEqual({
      styleURL: 'mapbox://styles/mapbox/standard',
      config: { lightPreset: 'day', theme: 'default' },
    });
    expect(mapStyleFor('street', 'dark').config.lightPreset).toBe('night');
    expect(mapStyleFor('concrete', 'light').config.theme).toBe('monochrome');
    expect(mapStyleFor('satellite', 'light').styleURL).toBe(
      'mapbox://styles/mapbox/standard-satellite',
    );
  });

  it('valor salvo inválido volta para Rua', () => {
    expect(parseStoredLayer('satellite')).toBe('satellite');
    expect(parseStoredLayer('concrete')).toBe('concrete');
    expect(parseStoredLayer(null)).toBe(DEFAULT_MAP_LAYER);
    expect(parseStoredLayer('noite')).toBe('street');
  });

  it('rótulo do botão diz a camada atual', () => {
    expect(layersButtonLabel('street')).toBe('Camadas do mapa, atual: Rua');
    expect(layersButtonLabel('satellite')).toBe('Camadas do mapa, atual: Satélite');
  });
});

describe('domain/map/location', () => {
  const run = (events: LocationEvent[], from: LocationState = INITIAL_LOCATION) =>
    events.reduce(locationReducer, from);

  it('ainda não pedida -> buscando -> centralizado -> mapa movido -> centralizado', () => {
    expect(locationButtonAction('idle')).toBe('request');
    let state = run([{ type: 'granted' }]);
    expect(state.status).toBe('searching');
    expect(locationButtonAction('searching')).toBe('none');

    state = run([{ type: 'fix', position: [1, 2] }, { type: 'centered' }], state);
    expect(state.status).toBe('centered');
    expect(state.position).toEqual([1, 2]);

    state = run([{ type: 'gesture' }], state);
    expect(state.status).toBe('moved');
    expect(locationButtonAction('moved')).toBe('center');

    state = run([{ type: 'recenter' }], state);
    expect(state.status).toBe('centered');
  });

  it('permissão negada abre o sheet; voltar dos ajustes sem permissão reinicia', () => {
    const denied = run([{ type: 'denied' }]);
    expect(denied.status).toBe('denied');
    expect(locationButtonAction('denied')).toBe('openPermissionSheet');
    expect(run([{ type: 'gesture' }], denied).status).toBe('denied');
    expect(run([{ type: 'reset' }], denied).status).toBe('idle');
    expect(run([{ type: 'granted' }], denied).status).toBe('searching');
  });

  it('erro na busca volta ao estado anterior (ou "movido" com posição conhecida)', () => {
    expect(run([{ type: 'granted' }, { type: 'error' }]).status).toBe('idle');
    const withPosition: LocationState = { status: 'searching', previous: 'idle', position: [1, 2] };
    expect(run([{ type: 'error' }], withPosition).status).toBe('moved');
    // Erro fora da busca não muda nada.
    expect(run([{ type: 'error' }]).status).toBe('idle');
  });

  it('rótulos de acessibilidade por estado', () => {
    expect(locationA11yLabel('idle')).toBe('Centralizar na minha localização');
    expect(locationA11yLabel('searching')).toBe('Buscando sua localização');
    expect(locationA11yLabel('centered')).toBe('Centralizado em você');
    expect(locationA11yLabel('moved')).toBe('Centralizar na minha localização');
    expect(locationA11yLabel('denied')).toBe(
      'Localização desativada. Toque para saber como ativar',
    );
  });
});
