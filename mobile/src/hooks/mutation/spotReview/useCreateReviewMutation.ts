import { useMutation } from '@apollo/client/react';
import { createReviewMutation } from './createReviewMutation';

export const useCreateReviewMutation = () => {
  const [mutate, { loading }] = useMutation(createReviewMutation, {
    fetchPolicy: 'no-cache',
  });

  return { mutate, loading };
};
