import { useQuery } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import { spotsQuery } from './spotsQuery';

/**
 * Lista os picos para o mapa. `unauthenticated` indica sessão expirada
 * (a tela leva ao Login); `error` cobre falhas de rede/servidor, e os dados
 * anteriores são mantidos enquanto recarrega.
 */
export const useSpotsQuery = () => {
  const { data, loading, error, refetch } = useQuery(spotsQuery, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const apiError = normalizeApolloError(error);

  return {
    spots: data?.getAllSpots ?? [],
    loading,
    error: Boolean(error),
    unauthenticated: apiError?.type === 'UNAUTHENTICATED',
    refetch: () => {
      refetch().catch(() => undefined);
    },
  };
};
