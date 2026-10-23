import { useCallback, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import {
  PAGE_SIZE,
  Review,
  ReviewsPage,
  appendPage,
} from '../../../domain/spot/reviews';
import { spotReviewsQuery } from './spotReviewsQuery';

export type ReviewsStatus = 'loading' | 'ready' | 'error';

/**
 * Avaliações do pico com paginação por cursor. A primeira página traz também
 * `myReview`, a média e o total; `loadMore` acrescenta as seguintes sem
 * repetir itens. `reload` volta à primeira página (após enviar/editar/excluir).
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
  // Evita respostas antigas sobrescreverem uma recarga mais nova.
  const generation = useRef(0);

  const fetchPage = useCallback(
    (after: string | null) =>
      client.query({
        query: spotReviewsQuery,
        variables: { spotId, first: PAGE_SIZE, after },
        fetchPolicy: 'network-only',
      }),
    [client, spotId],
  );

  const reload = useCallback(
    async (silent = false) => {
      const current = ++generation.current;
      if (!silent) {
        setStatus('loading');
      }
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
        setStatus('ready');
      } catch {
        if (current === generation.current) {
          setStatus(prev => (silent && prev === 'ready' ? prev : 'error'));
        }
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    reload();
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
      setItems(list => appendPage(list, page.items));
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      if (current === generation.current) setMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, fetchPage, hasMore, loadingMore, status]);

  return {
    status,
    items,
    ...meta,
    hasMore,
    loadingMore,
    moreError,
    reload,
    loadMore,
  };
};
