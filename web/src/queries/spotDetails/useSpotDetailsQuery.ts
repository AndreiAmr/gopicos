import { useQuery } from '@apollo/client';

import { parseApiError } from '@/utils/apiError';
import {
  SPOT_DETAILS_QUERY,
  type SpotDetailsQueryResult,
  type SpotDetailsQueryVariables,
} from './spotDetailsQuery';

export type SpotDetailsStatus =
  | 'loading'
  | 'ready'
  | 'notFound'
  | 'error'
  | 'unauthenticated';

/** Classifica o resultado da query para a tela (loading, pronto, não encontrado, erro, sessão). */
export const classifyStatus = (input: {
  hasSpot: boolean;
  loading: boolean;
  error: unknown;
}): SpotDetailsStatus => {
  const api = input.error ? parseApiError(input.error) : null;
  if (api?.type === 'UNAUTHENTICATED') return 'unauthenticated';
  if (api?.type === 'NOT_FOUND') return 'notFound';
  if (input.hasSpot) return 'ready';
  if (input.loading) return 'loading';
  if (input.error) return 'error';
  return 'notFound';
};

/** Detalhe do pico com o estado já classificado. */
export const useSpotDetailsQuery = (id: string) => {
  const { data, loading, error, refetch } = useQuery<
    SpotDetailsQueryResult,
    SpotDetailsQueryVariables
  >(SPOT_DETAILS_QUERY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const spot = data?.getSpotById ?? null;

  return {
    spot,
    status: classifyStatus({ hasSpot: Boolean(spot), loading, error }),
    refetch: () => {
      refetch().catch(() => undefined);
    },
  };
};
