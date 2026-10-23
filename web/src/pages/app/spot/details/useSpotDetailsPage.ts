import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { notify } from '@/lib/notify';
import { spotPageTitle } from '@/domain/spot/details';
import { useSpotDetailsQuery } from '@/queries/spotDetails/useSpotDetailsQuery';
import { logout } from '@/utils/logout';

export const useSpotDetailsPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { spot, status, refetch } = useSpotDetailsQuery(id);

  useEffect(() => {
    document.title = spotPageTitle(spot?.name);
  }, [spot?.name]);

  // Sessão expirada: volta ao Login com o aviso.
  useEffect(() => {
    if (status === 'unauthenticated') {
      void logout({ sessionExpired: true });
    }
  }, [status]);

  const onEdit = useCallback(() => navigate(`/spot/${id}/edit`), [id, navigate]);

  const onDelete = useCallback(() => {
    notify.info('Disponível em breve.');
  }, []);

  return { id, spot, status, refetch, onEdit, onDelete };
};
