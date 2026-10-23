import { useQuery } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import type { SpotsQueryFilter } from '../../../domain/spot/filters';
import { spotsQuery } from './spotsQuery';

/**
 * Lista os picos para o mapa. `unauthenticated` indica sessão expirada
 * (a tela leva ao Login); `error` cobre falhas de rede/servidor, e os dados
 * anteriores são mantidos enquanto recarrega.
 */
export const useSpotsQuery = (filter: SpotsQueryFilter | null = null) => {
  const { data, loading, error, refetch } = useQuery(spotsQuery, {
    variables: filter ? { filter } : {},
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const apiError = normalizeApolloError(error);

  return {
    spots: data?.getAllSpots ?? [],
    loading,
    error: Boolean(error),
    /** Falha de rede (sem resposta da API): a Home mostra "Sem conexão". */
    offline: Boolean(error) && apiError === null,
    unauthenticated: apiError?.type === 'UNAUTHENTICATED',
    refetch: () => {
      refetch().catch(() => undefined);
    },
  };
};
