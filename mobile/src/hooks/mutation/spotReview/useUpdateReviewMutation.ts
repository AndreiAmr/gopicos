import { useMutation } from '@apollo/client/react';
import { updateReviewMutation } from './updateReviewMutation';

export const useUpdateReviewMutation = () => {
  const [mutate, { loading }] = useMutation(updateReviewMutation, {
    fetchPolicy: 'no-cache',
  });

  return { mutate, loading };
};
