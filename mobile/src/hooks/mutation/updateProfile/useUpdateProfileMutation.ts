import { useMutation } from '@apollo/client/react';
import { updateProfileMutation } from './updateProfileMutation';

export const useUpdateProfileMutation = () => {
  const [mutate, { loading }] = useMutation(updateProfileMutation);

  return { mutate, loading };
};
