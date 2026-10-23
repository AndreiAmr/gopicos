import { useQuery } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import { spotDetailsQuery } from './spotDetailsQuery';

export type SpotDetailsStatus =
  | 'loading'
  | 'ready'
  | 'notFound'
  | 'error'
  | 'unauthenticated';

/** Detalhe do pico com o estado já classificado para a tela. */
export const useSpotDetailsQuery = (id: string) => {
  const { data, loading, error, refetch } = useQuery(spotDetailsQuery, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const apiError = normalizeApolloError(error);
  const spot = data?.getSpotById ?? null;

  let status: SpotDetailsStatus;
  if (apiError?.type === 'UNAUTHENTICATED') {
    status = 'unauthenticated';
  } else if (apiError?.type === 'NOT_FOUND') {
    status = 'notFound';
  } else if (spot) {
    status = 'ready';
  } else if (loading) {
    status = 'loading';
  } else if (error) {
    status = 'error';
  } else {
    status = 'notFound';
  }

  return {
    spot,
    status,
    refetch: () => {
      refetch().catch(() => undefined);
    },
  };
};
