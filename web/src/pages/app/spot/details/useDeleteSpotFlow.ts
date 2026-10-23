import { useCallback, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';

import { spotDetailsStrings } from '@/domain/spot/details';
import { notify } from '@/lib/notify';
import {
  DELETE_SPOT_MUTATION,
  type DeleteSpotResult,
  type DeleteSpotVariables,
} from '@/queries/spotDetails/deleteSpotMutation';
import { URL } from '@/routes/url';
import { parseApiError } from '@/utils/apiError';
import { logout } from '@/utils/logout';

/**
 * Excluir pico (GP-044, picos.md 8): confirmação em dialog, mutation, toast e
 * volta à Home, onde o mapa é recarregado ao entrar (o pico some sem
 * recarregar a página). Erro de rede mantém o dialog aberto com banner.
 */
export const useDeleteSpotFlow = (spotId: string) => {
  const navigate = useNavigate();
  const apollo = useApolloClient();
  const [deleteSpot, { loading: deleting }] = useMutation<
    DeleteSpotResult,
    DeleteSpotVariables
  >(DELETE_SPOT_MUTATION, { fetchPolicy: 'no-cache' });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openConfirm = useCallback(() => {
    setError(null);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  const leave = useCallback(() => {
    setOpen(false);
    // "Meus picos" e detalhe em cache não mostram mais o pico.
    apollo.refetchQueries({ include: ['MySpots'] }).catch(() => undefined);
    apollo.cache.evict({
      id: 'ROOT_QUERY',
      fieldName: 'getSpotById',
      args: { id: spotId },
    });
    apollo.cache.gc();
    navigate(URL.HOME, { replace: true });
  }, [apollo, navigate, spotId]);

  const confirm = useCallback(async () => {
    setError(null);
    try {
      await deleteSpot({ variables: { id: spotId } });
      leave();
      notify.success(spotDetailsStrings.deleteDone);
    } catch (caught) {
      const api = parseApiError(caught);

      if (api.type === 'NOT_FOUND') {
        leave();
        notify.info(spotDetailsStrings.deleteAlreadyGone);
      } else if (api.type === 'FORBIDDEN') {
        setOpen(false);
        notify.error(spotDetailsStrings.deleteForbidden);
      } else if (api.type === 'UNAUTHENTICATED') {
        setOpen(false);
        void logout({ sessionExpired: true });
      } else {
        setError(spotDetailsStrings.deleteError);
      }
    }
  }, [deleteSpot, leave, spotId]);

  return { open, deleting, error, openConfirm, close, confirm };
};
