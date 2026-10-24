import { useMutation } from '@apollo/client/react';
import { deleteReviewMutation } from './deleteReviewMutation';

export const useDeleteReviewMutation = () => {
  const [mutate, { loading }] = useMutation(deleteReviewMutation, {
    fetchPolicy: 'no-cache',
  });

  return { mutate, loading };
};
