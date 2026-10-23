import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import { reviewStrings } from '@/domain/spot/reviews';
import { notify } from '@/lib/notify';
import { CREATE_REVIEW_MUTATION } from '@/queries/spotReviews/spotReviewsQueries';
import { useSpotReviews } from '@/queries/spotReviews/useSpotReviews';
import { parseApiError } from '@/utils/apiError';
import { logout } from '@/utils/logout';

type Options = {
  spotId: string;
  /** Atualiza média e contagem do detalhe após uma mudança. */
  refreshSpot: () => void;
};

/**
 * Fluxo de avaliações do detalhe: lista paginada, dialog do formulário,
 * envio e reflexo imediato na média e na contagem.
 */
export const useReviewsFlow = ({ spotId, refreshSpot }: Options) => {
  const reviews = useSpotReviews(spotId);
  const [createReview, { loading: submitting }] = useMutation(
    CREATE_REVIEW_MUTATION,
    { fetchPolicy: 'no-cache' },
  );
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setCommentError(null);
  }, []);

  const openForm = useCallback(() => {
    clearErrors();
    setOpen(true);
  }, [clearErrors]);

  const closeForm = useCallback(() => {
    setOpen(false);
    clearErrors();
  }, [clearErrors]);

  const propagate = useCallback(() => {
    void reviews.reload(true);
    refreshSpot();
  }, [refreshSpot, reviews]);

  const submit = useCallback(
    async (rating: number, description: string) => {
      clearErrors();
      try {
        await createReview({
          variables: {
            data: { spotId, rating, description: description || null },
          },
        });
        setOpen(false);
        notify.success(reviewStrings.sent);
        propagate();
      } catch (caught) {
        const api = parseApiError(caught);

        if (api.type === 'UNAUTHENTICATED') {
          setOpen(false);
          void logout({ sessionExpired: true });
        } else if (api.type === 'REVIEW_ALREADY_EXISTS') {
          setOpen(false);
          notify.info(reviewStrings.alreadyReviewed);
          propagate();
        } else if (api.type === 'VALIDATION_ERROR') {
          setCommentError(api.message);
        } else {
          setError(reviewStrings.networkError);
        }
      }
    },
    [clearErrors, createReview, propagate, spotId],
  );

  return {
    reviews,
    open,
    submitting,
    error,
    commentError,
    openForm,
    closeForm,
    submit,
  };
};
