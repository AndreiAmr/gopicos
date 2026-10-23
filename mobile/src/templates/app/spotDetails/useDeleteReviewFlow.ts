import { useCallback, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { normalizeApolloError } from '../../../config/apollo';
import { useDeleteReviewMutation } from '../../../hooks/mutation/spotReview/useDeleteReviewMutation';
import { resetToLogin } from '../../../routes/navigationRef';
import { useToast } from '../../../atomic/ds';
import { reviewStrings } from '../../../domain/spot/reviews';

/**
 * Excluir minha avaliação (GP-066, picos.md 9A.3): confirmação em bottom
 * sheet, mutation, toast e atualização da lista, da média e do mapa
 * (`onDeleted`). Erro de rede mantém a confirmação aberta com banner.
 */
export const useDeleteReviewFlow = (onDeleted: () => void) => {
  const toast = useToast();
  const { mutate, loading: deleting } = useDeleteReviewMutation();

  const sheetRef = useRef<BottomSheetModal>(null);
  const targetId = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const open = useCallback((reviewId: string) => {
    targetId.current = reviewId;
    setError(null);
    sheetRef.current?.present();
  }, []);

  const cancel = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const confirm = useCallback(async () => {
    const id = targetId.current;
    if (!id) return;

    setError(null);
    try {
      await mutate({ variables: { id } });
      sheetRef.current?.dismiss();
      toast.show({ type: 'success', message: reviewStrings.deleted });
      onDeleted();
    } catch (caught) {
      const api = normalizeApolloError(caught);

      if (api?.type === 'NOT_FOUND') {
        // Já não existe: o resultado desejado aconteceu (UX-F8).
        sheetRef.current?.dismiss();
        toast.show({ type: 'info', message: reviewStrings.gone });
        onDeleted();
      } else if (api?.type === 'FORBIDDEN') {
        sheetRef.current?.dismiss();
        toast.show({ type: 'error', message: reviewStrings.forbidden });
      } else if (api?.type === 'UNAUTHENTICATED') {
        sheetRef.current?.dismiss();
        resetToLogin({ notice: 'sessionExpired' });
      } else {
        setError(reviewStrings.deleteError);
      }
    }
  }, [mutate, onDeleted, toast]);

  return { sheetRef, deleting, error, open, cancel, confirm, clearError };
};
