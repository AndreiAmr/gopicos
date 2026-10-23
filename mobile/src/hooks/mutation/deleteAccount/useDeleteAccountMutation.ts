import { useMutation } from '@apollo/client/react';
import { deleteAccountMutation } from './deleteAccountMutation';

export const useDeleteAccountMutation = () => {
  const [mutate, { loading }] = useMutation(deleteAccountMutation, {
    fetchPolicy: 'no-cache',
  });

  return { mutate, loading };
};
