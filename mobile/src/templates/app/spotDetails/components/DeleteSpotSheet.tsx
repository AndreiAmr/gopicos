import { forwardRef } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'tamagui';
import { space } from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { AlertBanner } from '../../../../atomic/ds/auth/AlertBanner';
import { BottomSheet } from '../../../../atomic/ds/molecules/BottomSheet';
import { spotDetailsStrings } from '../strings';

type DeleteSpotSheetProps = {
  deleting: boolean;
  /** Erro mostrado dentro da confirmação, que continua aberta. */
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
};

/**
 * Confirmação de exclusão (picos.md 8): destrutivo em cima, cancelar embaixo,
 * ambos desabilitados enquanto exclui. Sem digitar o nome (UX-P11).
 */
export const DeleteSpotSheet = forwardRef<BottomSheetModal, DeleteSpotSheetProps>(
  ({ deleting, error, onConfirm, onCancel, onClose }, ref) => (
    <BottomSheet
      ref={ref}
      title={spotDetailsStrings.deleteTitle}
      description={spotDetailsStrings.deleteDescription}
      onClose={onClose}
    >
      <View gap={space[3]} testID="delete-spot-sheet">
        {error ? (
          <AlertBanner type="error" message={error} testID="delete-spot-error" />
        ) : null}
        <View gap={space[2]}>
          <Button
            label={spotDetailsStrings.deleteConfirm}
            variant="destructive"
            loading={deleting}
            onPress={onConfirm}
            fullWidth
            testID="delete-spot-confirm"
          />
          <Button
            label={spotDetailsStrings.deleteCancel}
            variant="ghost"
            disabled={deleting}
            onPress={onCancel}
            fullWidth
            testID="delete-spot-cancel"
          />
        </View>
      </View>
    </BottomSheet>
  ),
);

DeleteSpotSheet.displayName = 'DeleteSpotSheet';
