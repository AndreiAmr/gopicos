import { useMutation } from '@apollo/client/react';
import { deleteSpotMutation } from './deleteSpotMutation';

export const useDeleteSpotMutation = () => {
  const [mutate, { loading }] = useMutation(deleteSpotMutation, {
    fetchPolicy: 'no-cache',
  });

  return { mutate, loading };
};
