import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';
import { GraphQLError } from 'graphql';

import { spotDetailsQuery } from './spotDetailsQuery';
import { useSpotDetailsQuery } from './useSpotDetailsQuery';

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const spot = {
  id: 's1',
  name: 'Pico',
  description: 'd',
  modality: 'street',
  isPaid: false,
  entryAmount: null,
  alwaysOpen: true,
  openingHours: null,
  hasCoverage: false,
  equipmentRequired: false,
  images: [],
  coordinates: null,
  ratingAverage: null,
  reviewsCount: 0,
  isOwner: true,
  author: { id: 'u1', displayName: 'Marina S.' },
};

const request = { query: spotDetailsQuery, variables: { id: 's1' } };

const render = async (mocks: Mocks) =>
  await renderHook(() => useSpotDetailsQuery('s1'), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

// O backend devolve `type` na raiz do erro (formatError), que é o que
// normalizeApolloError lê.
const apiError = (type: string) =>
  Object.assign(new GraphQLError('erro', { extensions: { type } }), { type });

describe('useSpotDetailsQuery', () => {
  it('loading e depois ready com o pico', async () => {
    const { result } = await render([
      { request, result: { data: { getSpotById: spot } } },
    ]);

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.spot?.author?.displayName).toBe('Marina S.');
  });

  it('NOT_FOUND vira notFound', async () => {
    const { result } = await render([
      { request, result: { errors: [apiError('NOT_FOUND')] } },
    ]);

    await waitFor(() => expect(result.current.status).toBe('notFound'));
  });

  it('UNAUTHENTICATED vira unauthenticated', async () => {
    const { result } = await render([
      { request, result: { errors: [apiError('UNAUTHENTICATED')] } },
    ]);

    await waitFor(() => expect(result.current.status).toBe('unauthenticated'));
  });

  it('falha de rede vira error', async () => {
    const { result } = await render([{ request, error: new Error('rede') }]);

    await waitFor(() => expect(result.current.status).toBe('error'));
  });
});
