import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import { resetToLogin } from '../../../routes/navigationRef';
import { myReviewsQuery, mySpotsQuery } from './myActivityQueries';

const useSessionGuard = (error: unknown) => {
  const expired = normalizeApolloError(error)?.type === 'UNAUTHENTICATED';

  useEffect(() => {
    if (expired) resetToLogin({ notice: 'sessionExpired' });
  }, [expired]);
};

const useRefresh = (refetch: () => Promise<unknown>) => {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {
      // o erro aparece pelo estado `error` da query
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return { refreshing, refresh };
};

/** Picos cadastrados pelo usuário logado (mais recentes primeiro). */
export const useMySpots = () => {
  const { data, loading, error, refetch } = useQuery(mySpotsQuery, {
    fetchPolicy: 'cache-and-network',
  });
  useSessionGuard(error);
  const { refreshing, refresh } = useRefresh(refetch);

  const spots = data?.mySpots ?? null;

  return {
    spots,
    loading: loading && !spots,
    error: spots ? null : (error ?? null),
    refreshing,
    refresh,
  };
};

/** Avaliações feitas pelo usuário logado (mais recentes primeiro). */
export const useMyReviews = () => {
  const { data, loading, error, refetch } = useQuery(myReviewsQuery, {
    fetchPolicy: 'cache-and-network',
  });
  useSessionGuard(error);
  const { refreshing, refresh } = useRefresh(refetch);

  const reviews = data?.myReviews ?? null;

  return {
    reviews,
    loading: loading && !reviews,
    error: reviews ? null : (error ?? null),
    refreshing,
    refresh,
  };
};
