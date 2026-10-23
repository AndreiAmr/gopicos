import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';
import { Review } from '../../../domain/spot/reviews';
import { spotReviewsQuery } from './spotReviewsQuery';
import { useSpotReviews } from './useSpotReviews';

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const review = (id: string, over: Partial<Review> = {}): Review => ({
  id,
  rating: 4,
  description: null,
  createdAt: '2026-10-12T15:00:00.000Z',
  author: { id: 'u', displayName: 'Marina S.' },
  isMine: false,
  ...over,
});

const page = (over: object) => ({
  items: [],
  nextCursor: null,
  hasMore: false,
  totalCount: 0,
  ratingAverage: null,
  myReview: null,
  ...over,
});

const render = async (mocks: Mocks) =>
  await renderHook(() => useSpotReviews('s1'), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

const request = (after: string | null) => ({
  query: spotReviewsQuery,
  variables: { spotId: 's1', first: 10, after },
});

describe('useSpotReviews', () => {
  it('carrega a primeira página com minha avaliação, média e total', async () => {
    const mine = review('m1', { isMine: true });
    const { result } = await render([
      {
        request: request(null),
        result: {
          data: {
            getSpotReviews: page({
              items: [review('a')],
              totalCount: 2,
              ratingAverage: 4.5,
              myReview: mine,
            }),
          },
        },
      },
    ]);

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.items.map(item => item.id)).toEqual(['a']);
    expect(result.current.myReview?.id).toBe('m1');
    expect(result.current.totalCount).toBe(2);
    expect(result.current.ratingAverage).toBe(4.5);
    expect(result.current.hasMore).toBe(false);
  });

  it('carrega a próxima página pelo cursor sem repetir itens', async () => {
    const { result } = await render([
      {
        request: request(null),
        result: {
          data: {
            getSpotReviews: page({
              items: [review('a'), review('b')],
              nextCursor: 'b',
              hasMore: true,
              totalCount: 3,
            }),
          },
        },
      },
      {
        request: request('b'),
        result: {
          data: {
            getSpotReviews: page({
              items: [review('b'), review('c')],
              totalCount: 3,
            }),
          },
        },
      },
    ]);

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() =>
      expect(result.current.items.map(item => item.id)).toEqual(['a', 'b', 'c']),
    );
    expect(result.current.hasMore).toBe(false);
  });

  it('falha na primeira página vira erro e permite recarregar', async () => {
    const { result } = await render([
      { request: request(null), error: new Error('rede') },
      {
        request: request(null),
        result: { data: { getSpotReviews: page({ totalCount: 0 }) } },
      },
    ]);

    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => {
      await result.current.reload();
    });
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });

  it('falha ao carregar mais mantém a lista e sinaliza o erro', async () => {
    const { result } = await render([
      {
        request: request(null),
        result: {
          data: {
            getSpotReviews: page({
              items: [review('a')],
              nextCursor: 'a',
              hasMore: true,
              totalCount: 2,
            }),
          },
        },
      },
      { request: request('a'), error: new Error('rede') },
    ]);

    await waitFor(() => expect(result.current.status).toBe('ready'));
    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.moreError).toBe(true);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.status).toBe('ready');
  });
});
