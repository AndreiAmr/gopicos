import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';

import { spotsQuery } from './spotsQuery';
import { useSpotsQuery } from './useSpotsQuery';

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const spot = {
  id: 's1',
  name: 'Pico',
  modality: 'street',
  coordinates: null,
  ratingAverage: 4.5,
  reviewsCount: 2,
};

const render = async (mocks: Mocks) =>
  await renderHook(() => useSpotsQuery(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

describe('useSpotsQuery', () => {
  it('carrega e devolve os picos', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, result: { data: { getAllSpots: [spot] } } },
    ]);

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.spots).toEqual([
      expect.objectContaining({ id: 's1', reviewsCount: 2 }),
    ]);
    expect(result.current.error).toBe(false);
  });

  it('lista vazia não é erro', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, result: { data: { getAllSpots: [] } } },
    ]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.spots).toEqual([]);
    expect(result.current.error).toBe(false);
  });

  it('falha de rede marca erro', async () => {
    const { result } = await render([
      { request: { query: spotsQuery }, error: new Error('rede') },
    ]);

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.unauthenticated).toBe(false);
  });
});
