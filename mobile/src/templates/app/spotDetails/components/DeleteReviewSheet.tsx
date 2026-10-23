import { forwardRef } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'tamagui';
import { space } from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { AlertBanner } from '../../../../atomic/ds/auth/AlertBanner';
import { BottomSheet } from '../../../../atomic/ds/molecules/BottomSheet';
import { reviewStrings } from '../../../../domain/spot/reviews';

type DeleteReviewSheetProps = {
  deleting: boolean;
  /** Erro mostrado dentro da confirmação, que continua aberta. */
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
};

/**
 * Confirmação de excluir minha avaliação (picos.md 9A.3): destrutivo em cima,
 * cancelar embaixo, ambos travados enquanto exclui.
 */
export const DeleteReviewSheet = forwardRef<
  BottomSheetModal,
  DeleteReviewSheetProps
>(({ deleting, error, onConfirm, onCancel, onClose }, ref) => (
  <BottomSheet
    ref={ref}
    title={reviewStrings.deleteTitle}
    description={reviewStrings.deleteDescription}
    onClose={onClose}
  >
    <View gap={space[3]} testID="delete-review-sheet">
      {error ? (
        <AlertBanner type="error" message={error} testID="delete-review-error" />
      ) : null}
      <View gap={space[2]}>
        <Button
          label={reviewStrings.deleteConfirm}
          variant="destructive"
          loading={deleting}
          onPress={onConfirm}
          fullWidth
          testID="delete-review-confirm"
        />
        <Button
          label={reviewStrings.cancel}
          variant="ghost"
          disabled={deleting}
          onPress={onCancel}
          fullWidth
          testID="delete-review-cancel"
        />
      </View>
    </View>
  </BottomSheet>
));

DeleteReviewSheet.displayName = 'DeleteReviewSheet';
