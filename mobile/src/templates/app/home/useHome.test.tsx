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
});
