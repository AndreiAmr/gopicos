import { useCallback, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import {
  PAGE_SIZE,
  appendPage,
  type Review,
  type ReviewsPage,
} from '@/domain/spot/reviews';
import {
  SPOT_REVIEWS_QUERY,
  type SpotReviewsResult,
  type SpotReviewsVariables,
} from './spotReviewsQueries';

export type ReviewsStatus = 'loading' | 'ready' | 'error';

/**
 * Avaliações do pico com paginação por cursor ("Carregar mais"). A primeira
 * página traz também `myReview`, a média e o total. `reload(true)` recarrega
 * em silêncio (após enviar/editar/excluir).
 */
export const useSpotReviews = (spotId: string) => {
  const client = useApolloClient();
  const [status, setStatus] = useState<ReviewsStatus>('loading');
  const [items, setItems] = useState<Review[]>([]);
  const [meta, setMeta] = useState<
    Pick<ReviewsPage, 'myReview' | 'totalCount' | 'ratingAverage'>
  >({ myReview: null, totalCount: 0, ratingAverage: null });
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  /** Quantos itens a última página trouxe (para foco e anúncio). */
  const [lastLoaded, setLastLoaded] = useState<{ firstId: string; count: number } | null>(
    null,
  );
  const generation = useRef(0);

  const fetchPage = useCallback(
    (after: string | null) =>
      client.query<SpotReviewsResult, SpotReviewsVariables>({
        query: SPOT_REVIEWS_QUERY,
        variables: { spotId, first: PAGE_SIZE, after },
        fetchPolicy: 'network-only',
      }),
    [client, spotId],
  );

  const reload = useCallback(
    async (silent = false) => {
      const current = ++generation.current;
      if (!silent) setStatus('loading');
      try {
        const { data } = await fetchPage(null);
        if (current !== generation.current || !data) return;
        const page = data.getSpotReviews;
        setItems(page.items);
        setMeta({
          myReview: page.myReview,
          totalCount: page.totalCount,
          ratingAverage: page.ratingAverage,
        });
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setMoreError(false);
        setLastLoaded(null);
        setStatus('ready');
      } catch {
        if (current === generation.current) {
          setStatus((prev) => (silent && prev === 'ready' ? prev : 'error'));
        }
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  const loadMore = useCallback(async () => {
    if (status !== 'ready' || !hasMore || loadingMore || !cursor) return;
    const current = generation.current;
    setLoadingMore(true);
    setMoreError(false);
    try {
      const { data } = await fetchPage(cursor);
      if (current !== generation.current || !data) return;
      const page = data.getSpotReviews;
      const fresh = appendPage(items, page.items).slice(items.length);
      setItems((list) => appendPage(list, page.items));
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
      if (fresh.length > 0) {
        setLastLoaded({ firstId: fresh[0].id, count: fresh.length });
      }
    } catch {
      if (current === generation.current) setMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, fetchPage, hasMore, items, loadingMore, status]);

  return {
    status,
    items,
    ...meta,
    hasMore,
    loadingMore,
    moreError,
    lastLoaded,
    reload,
    loadMore,
  };
};
