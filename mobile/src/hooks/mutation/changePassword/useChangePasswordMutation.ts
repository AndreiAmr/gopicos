import { useMutation } from '@apollo/client/react';
import { changePasswordMutation } from './changePasswordMutation';

export const useChangePasswordMutation = () => {
  const [mutate, { loading }] = useMutation(changePasswordMutation, {
    fetchPolicy: 'no-cache',
  });

  return { mutate, loading };
};
