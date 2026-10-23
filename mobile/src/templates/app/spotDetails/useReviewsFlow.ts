import { useCallback, useRef, useState } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useApolloClient } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import { useCreateReviewMutation } from '../../../hooks/mutation/spotReview/useCreateReviewMutation';
import { useSpotReviews } from '../../../hooks/query/spotReviews/useSpotReviews';
import { useToast } from '../../../atomic/ds';
import { isNearEnd, reviewStrings } from '../../../domain/spot/reviews';

type Options = {
  spotId: string;
  /** Atualiza média e contagem do detalhe após uma mudança. */
  refreshSpot: () => void;
};

/**
 * Fluxo de avaliações do detalhe: lista paginada, abertura do formulário,
 * envio e reflexo imediato na média, na contagem, no detalhe e no mapa.
 */
export const useReviewsFlow = ({ spotId, refreshSpot }: Options) => {
  const reviews = useSpotReviews(spotId);
  const { mutate, loading: submitting } = useCreateReviewMutation();
  const apollo = useApolloClient();
  const toast = useToast();

  const sheetRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setCommentError(null);
  }, []);

  const openForm = useCallback(() => {
    clearErrors();
    sheetRef.current?.present();
  }, [clearErrors]);

  const propagate = useCallback(() => {
    reviews.reload(true);
    refreshSpot();
    // Pin e resumo da Home refletem a nova nota sem recarregar (spec 10).
    apollo.refetchQueries({ include: ['GetAllSpots'] }).catch(() => undefined);
  }, [apollo, refreshSpot, reviews]);

  const submit = useCallback(
    async (rating: number, description: string) => {
      clearErrors();
      try {
        await mutate({
          variables: {
            data: { spotId, rating, description: description || null },
          },
        });
        sheetRef.current?.dismiss();
        toast.show({ type: 'success', message: reviewStrings.sent });
        propagate();
      } catch (caught) {
        const api = normalizeApolloError(caught);

        if (api?.type === 'REVIEW_ALREADY_EXISTS') {
          sheetRef.current?.dismiss();
          toast.show({ type: 'info', message: reviewStrings.alreadyReviewed });
          propagate();
        } else if (api?.type === 'VALIDATION_ERROR') {
          setCommentError(api.message);
        } else {
          setError(reviewStrings.networkError);
        }
      }
    },
    [clearErrors, mutate, propagate, spotId, toast],
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentSize, contentOffset } =
        event.nativeEvent;
      if (
        isNearEnd(
          layoutMeasurement.height,
          contentSize.height,
          contentOffset.y,
        )
      ) {
        reviews.loadMore();
      }
    },
    [reviews],
  );

  const scrollToReviews = useCallback(() => {
    scrollRef.current?.scrollTo({ y: sectionY.current, animated: true });
  }, []);

  return {
    reviews,
    sheetRef,
    scrollRef,
    sectionY,
    submitting,
    error,
    commentError,
    openForm,
    submit,
    onScroll,
    scrollToReviews,
    clearErrors,
  };
};
