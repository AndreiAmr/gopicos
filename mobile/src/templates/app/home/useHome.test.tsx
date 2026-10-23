import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';
import { spotsQuery } from '../../../hooks/query/spots/spotsQuery';
import { useHome } from './useHome';

const mockNavigate = jest.fn();
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
}));
jest.mock('../../../services/session', () => ({
  clearSession: jest.fn(() => Promise.resolve()),
}));

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const spot = {
  id: 's1',
  name: 'Pico',
  modality: 'street',
  coordinates: {
    type: 'Polygon',
    coordinates: [
      [
        [-46.66, -23.56],
        [-46.64, -23.56],
        [-46.64, -23.54],
        [-46.66, -23.54],
        [-46.66, -23.56],
      ],
    ],
  },
  ratingAverage: 4,
  reviewsCount: 1,
};

const render = async (mocks: Mocks) =>
  await renderHook(() => useHome(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

describe('useHome', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loading na primeira carga e depois seleciona e abre o detalhe', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot] } } },
    ]);

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.spots).toHaveLength(1));

    await act(async () => result.current.select('s1'));
    expect(result.current.selected?.id).toBe('s1');
    expect(result.current.distanceLabel).toBeUndefined();

    await act(async () => result.current.setUserPosition([-46.65, -23.55]));
    expect(result.current.distanceLabel).toMatch(/de você$/);

    await act(async () => result.current.openDetails());
    expect(mockNavigate).toHaveBeenCalledWith('SpotDetails', { id: 's1' });

    await act(async () => result.current.clearSelection());
    expect(result.current.selected).toBeNull();
  });

  it('lista vazia fica no estado vazio e abre o sheet', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, result: { data: { getAllSpots: [] } } },
    ]);

    await waitFor(() => expect(result.current.isEmpty).toBe(true));
    expect(result.current.hasError).toBe(false);
    // Vazio é estado persistente: o sheet começa aberto.
    expect(result.current.emptySheetOpen).toBe(true);
  });

  it('fechar o sheet do vazio é respeitado enquanto o vazio persistir', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, result: { data: { getAllSpots: [] } } },
    ]);

    await waitFor(() => expect(result.current.isEmpty).toBe(true));

    await act(async () => result.current.dismissEmptySheet());
    expect(result.current.emptySheetOpen).toBe(false);
    // Continua vazio, mas o sheet não deve reabrir sozinho.
    expect(result.current.isEmpty).toBe(true);
  });

  it('falha de rede expõe o erro', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, error: new Error('rede') },
    ]);

    await waitFor(() => expect(result.current.hasError).toBe(true));
    expect(result.current.isEmpty).toBe(false);
  });

  describe('filtros', () => {
    const park = { ...spot, id: 's2', modality: 'park' };
    const bowl = { ...spot, id: 's3', modality: 'bowl_pool' };

    it('aplica entrada e cobertura no backend e a modalidade (OU) no cliente', async () => {
      const { result } = await render([
        {
          request: { query: spotsQuery },
          result: { data: { getAllSpots: [spot, park, bowl] } },
        },
        {
          request: {
            query: spotsQuery,
            variables: { filter: { isPaid: false, hasCoverage: true } },
          },
          result: { data: { getAllSpots: [spot, park, bowl] } },
        },
      ]);
      await waitFor(() => expect(result.current.spots).toHaveLength(3));

      await act(async () =>
        result.current.applyFilters({
          modalities: ['street', 'park'],
          entry: 'free',
          coveredOnly: true,
          minRating: 0,
        }),
      );

      expect(result.current.applying).toBe(true);
      await waitFor(() => expect(result.current.applying).toBe(false));
      expect(result.current.spots.map(item => item.id)).toEqual(['s1', 's2']);
      expect(result.current.filtersActive).toBe(true);
    });

    it('limpar filtros volta à listagem completa', async () => {
      const { result } = await render([
        { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot, park] } } },
        {
          request: { query: spotsQuery, variables: { filter: { minRating: 4 } } },
          result: { data: { getAllSpots: [] } },
        },
        { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot, park] } } },
      ]);
      await waitFor(() => expect(result.current.spots).toHaveLength(2));

      await act(async () =>
        result.current.applyFilters({
          modalities: [],
          entry: 'all',
          coveredOnly: false,
          minRating: 4,
        }),
      );
      await waitFor(() => expect(result.current.isEmpty).toBe(true));
      expect(result.current.filtersActive).toBe(true);

      await act(async () => result.current.clearFilters());
      await waitFor(() => expect(result.current.spots).toHaveLength(2));
      expect(result.current.filtersActive).toBe(false);
    });

    it('falha ao aplicar mantém o filtro anterior e sinaliza o erro', async () => {
      const { result } = await render([
        { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot] } } },
        {
          request: { query: spotsQuery, variables: { filter: { isPaid: true } } },
          error: new Error('rede'),
        },
      ]);
      await waitFor(() => expect(result.current.spots).toHaveLength(1));

      await act(async () =>
        result.current.applyFilters({
          modalities: [],
          entry: 'paid',
          coveredOnly: false,
          minRating: 0,
        }),
      );

      await waitFor(() => expect(result.current.applyFailed).toBe(true));
      expect(result.current.filters.entry).toBe('all');
      expect(result.current.applying).toBe(false);
    });
  });

  describe('contagem na área e prévia (spec home.md 6.1 e UX-H19)', () => {
    const far = {
      ...spot,
      id: 'far',
      modality: 'park',
      coordinates: {
        type: 'Polygon',
        coordinates: [[[10, 10], [10.01, 10], [10.01, 10.01], [10, 10.01], [10, 10]]],
      },
    };
    const area = { ne: [-46.6, -23.5] as [number, number], sw: [-46.7, -23.6] as [number, number] };

    it('conta só os picos da área visível e mostra o vazio da área', async () => {
      const { result } = await render([
        { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot, far] } } },
      ]);
      await waitFor(() => expect(result.current.spots).toHaveLength(2));
      expect(result.current.tape.text).toBe('Carregando picos...');

      await act(async () => result.current.setBounds(area));
      expect(result.current.areaCount).toBe(1);
      expect(result.current.tape.text).toBe('1 pico na área');
      expect(result.current.isEmpty).toBe(false);

      await act(async () =>
        result.current.setBounds({ ne: [0.1, 0.1], sw: [0, 0] }),
      );
      expect(result.current.tape.text).toBe('Nenhum pico na área');
      expect(result.current.isEmpty).toBe(true);
      expect(result.current.emptyKind).toBe('empty');
    });

    it('a prévia filtra no cliente sem mudar os filtros aplicados', async () => {
      const { result } = await render([
        { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot, far] } } },
      ]);
      await waitFor(() => expect(result.current.spots).toHaveLength(2));
      await act(async () => result.current.setBounds(area));

      await act(async () =>
        result.current.setPreview({ modalities: ['park'], entry: 'all', coveredOnly: false, minRating: 0 }),
      );
      expect(result.current.spots.map(item => item.id)).toEqual(['far']);
      expect(result.current.tape.text).toBe('0 picos com 1 filtro');
      expect(result.current.filterCount).toBe(1);
      expect(result.current.filtersActive).toBe(false);

      await act(async () => result.current.setPreview(null));
      expect(result.current.spots).toHaveLength(2);
      expect(result.current.tape.text).toBe('1 pico na área');
    });
  });
});
