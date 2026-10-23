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
import { useUpdateReviewMutation } from '../../../hooks/mutation/spotReview/useUpdateReviewMutation';
import { useSpotReviews } from '../../../hooks/query/spotReviews/useSpotReviews';
import { useToast } from '../../../atomic/ds';
import {
  Review,
  isNearEnd,
  reviewStrings,
} from '../../../domain/spot/reviews';

type Options = {
  spotId: string;
  /** Atualiza média e contagem do detalhe após uma mudança. */
  refreshSpot: () => void;
};

/**
 * Fluxo de avaliações do detalhe: lista paginada, abertura do formulário
 * (nova ou edição da minha), envio e reflexo imediato na média, na contagem,
 * no detalhe e no mapa.
 */
export const useReviewsFlow = ({ spotId, refreshSpot }: Options) => {
  const reviews = useSpotReviews(spotId);
  const { mutate, loading: creating } = useCreateReviewMutation();
  const { mutate: update, loading: updating } = useUpdateReviewMutation();
  const submitting = creating || updating;
  const apollo = useApolloClient();
  const toast = useToast();

  const sheetRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  // Avaliação em edição; `null` = formulário de nova avaliação.
  const [editing, setEditing] = useState<Review | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setCommentError(null);
  }, []);

  const openForm = useCallback(() => {
    clearErrors();
    setEditing(null);
    sheetRef.current?.present();
  }, [clearErrors]);

  // "Editar" na minha avaliação: reabre o sheet preenchido.
  const openEdit = useCallback(
    (review: Review) => {
      clearErrors();
      // Cópia nova: o formulário sempre recomeça da avaliação salva, mesmo
      // depois de um rascunho descartado.
      setEditing({ ...review });
      sheetRef.current?.present();
    },
    [clearErrors],
  );

  const propagate = useCallback(() => {
    reviews.reload(true);
    refreshSpot();
    // Pin e resumo da Home refletem a nova nota sem recarregar (spec 10).
    apollo.refetchQueries({ include: ['GetAllSpots'] }).catch(() => undefined);
  }, [apollo, refreshSpot, reviews]);

  const submitNew = useCallback(
    async (rating: number, description: string) => {
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
    [mutate, propagate, spotId, toast],
  );

  const submitEdit = useCallback(
    async (review: Review, rating: number, description: string) => {
      try {
        await update({
          variables: {
            id: review.id,
            data: { rating, description: description || null },
          },
        });
        sheetRef.current?.dismiss();
        toast.show({ type: 'success', message: reviewStrings.updated });
        propagate();
      } catch (caught) {
        const api = normalizeApolloError(caught);

        if (api?.type === 'NOT_FOUND' || api?.type === 'FORBIDDEN') {
          // Excluída em outro aparelho (ou não é minha): mostra o estado real.
          sheetRef.current?.dismiss();
          toast.show({
            type: 'info',
            message:
              api.type === 'NOT_FOUND'
                ? reviewStrings.gone
                : reviewStrings.forbidden,
          });
          propagate();
        } else if (api?.type === 'VALIDATION_ERROR') {
          setCommentError(api.message);
        } else {
          setError(reviewStrings.networkError);
        }
      }
    },
    [propagate, toast, update],
  );

  const submit = useCallback(
    async (rating: number, description: string) => {
      clearErrors();
      if (editing) {
        await submitEdit(editing, rating, description);
      } else {
        await submitNew(rating, description);
      }
    },
    [clearErrors, editing, submitEdit, submitNew],
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
    editing,
    openForm,
    openEdit,
    submit,
    propagate,
    onScroll,
    scrollToReviews,
    clearErrors,
  };
};
