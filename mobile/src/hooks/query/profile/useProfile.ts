import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import { resetToLogin } from '../../../routes/navigationRef';
import { profileQuery } from './profileQuery';

export const UNAUTHENTICATED = 'UNAUTHENTICATED';

/**
 * Perfil do usuário logado (`me`). Sessão inválida (`UNAUTHENTICATED`) leva ao
 * Login com o aviso de sessão expirada. O cache é compartilhado: depois de
 * salvar o perfil, todas as telas já mostram o nome novo.
 */
export const useProfile = () => {
  const { data, loading, error, refetch } = useQuery(profileQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const [refreshing, setRefreshing] = useState(false);

  const profile = data?.me ?? null;
  const apiError = normalizeApolloError(error);
  const sessionExpired = apiError?.type === UNAUTHENTICATED;

  useEffect(() => {
    if (sessionExpired) {
      resetToLogin({ notice: 'sessionExpired' });
    }
  }, [sessionExpired]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {
      // o erro aparece pelo estado `error` do hook
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    profile,
    loading: loading && !profile,
    error: profile ? null : (error ?? null),
    refreshing,
    refresh,
  };
};
