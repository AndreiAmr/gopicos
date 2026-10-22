import { useMutation } from '@apollo/client/react';
import { signupMutation } from './signupMutation';

export const useSignupMutation = () => {
  const [mutate, { data, loading, error, reset }] = useMutation(
    signupMutation,
    { fetchPolicy: 'no-cache' },
  );

  return { mutate, data: data?.signup, loading, error, reset };
};
