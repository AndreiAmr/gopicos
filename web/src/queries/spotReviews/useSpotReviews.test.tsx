import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import type { Review } from '@/domain/spot/reviews';
import { useSpotReviews } from './useSpotReviews';

const review = (id: string): Review => ({
  id,
  rating: 4,
  description: null,
  createdAt: '2026-10-12T15:00:00.000Z',
  author: { id: 'u', displayName: 'Marina S.' },
  isMine: false,
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

const setup = (query: ReturnType<typeof vi.fn>) => {
  const client = new ApolloClient({ cache: new InMemoryCache() });
  client.query = query as never;
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
  return renderHook(() => useSpotReviews('s1'), { wrapper });
};

describe('useSpotReviews (web)', () => {
  it('carrega a primeira página com minha avaliação, média e total', async () => {
    const query = vi.fn().mockResolvedValue({
      data: {
        getSpotReviews: page({
          items: [review('a')],
          totalCount: 2,
          ratingAverage: 4.5,
          myReview: { ...review('m'), isMine: true },
        }),
      },
    });
    const { result } = setup(query);

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.myReview?.id).toBe('m');
    expect(result.current.totalCount).toBe(2);
    expect(query.mock.calls[0][0].variables).toEqual({
      spotId: 's1',
      first: 10,
      after: null,
    });
  });

  it('"Carregar mais" usa o cursor, não repete itens e informa o que chegou', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: {
          getSpotReviews: page({
            items: [review('a'), review('b')],
            nextCursor: 'b',
            hasMore: true,
            totalCount: 4,
          }),
        },
      })
      .mockResolvedValueOnce({
        data: {
          getSpotReviews: page({
            items: [review('b'), review('c'), review('d')],
            totalCount: 4,
          }),
        },
      });
    const { result } = setup(query);
    await waitFor(() => expect(result.current.status).toBe('ready'));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.items.map((i) => i.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(result.current.lastLoaded).toEqual({ firstId: 'c', count: 2 });
    expect(result.current.hasMore).toBe(false);
    expect(query.mock.calls[1][0].variables.after).toBe('b');
  });

  it('erro na primeira página e erro ao carregar mais', async () => {
    const query = vi
      .fn()
      .mockRejectedValueOnce(new Error('rede'))
      .mockResolvedValueOnce({
        data: {
          getSpotReviews: page({
            items: [review('a')],
            nextCursor: 'a',
            hasMore: true,
            totalCount: 2,
          }),
        },
      })
      .mockRejectedValueOnce(new Error('rede'));
    const { result } = setup(query);

    await waitFor(() => expect(result.current.status).toBe('error'));
    await act(async () => {
      await result.current.reload();
    });
    await waitFor(() => expect(result.current.status).toBe('ready'));

    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.moreError).toBe(true);
    expect(result.current.items).toHaveLength(1);
  });
});
