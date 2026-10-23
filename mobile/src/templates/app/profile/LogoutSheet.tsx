import { forwardRef } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'tamagui';
import { space } from '../../../config/tamagui/tokens';
import { Button } from '../../../atomic/ds/atoms/Button';
import { BottomSheet } from '../../../atomic/ds/molecules/BottomSheet';
import { useTabBarHeight } from '../../../routes/HomeStack/TabBar';
import { profileStrings } from './logic';

type LogoutSheetProps = {
  leaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * P7 - Sair (perfil.md 10): confirmação em bottom sheet acima da tab bar
 * (nunca a cobre). "Sair" em cima, "Cancelar" embaixo; ambos travam enquanto
 * a sessão é encerrada.
 */
export const LogoutSheet = forwardRef<BottomSheetModal, LogoutSheetProps>(
  ({ leaving, onConfirm, onCancel }, ref) => {
    const tabBarHeight = useTabBarHeight();

    return (
      <BottomSheet
        ref={ref}
        title={profileStrings.logoutTitle}
        description={profileStrings.logoutMessage}
        bottomInset={tabBarHeight}
        testID="logout-sheet"
      >
        <View gap={space[2]}>
          <Button
            label={profileStrings.logout}
            loading={leaving}
            onPress={onConfirm}
            fullWidth
            testID="logout-confirm"
          />
          <Button
            label={profileStrings.cancel}
            variant="ghost"
            disabled={leaving}
            onPress={onCancel}
            fullWidth
            testID="logout-cancel"
          />
        </View>
      </BottomSheet>
    );
  },
);

LogoutSheet.displayName = 'LogoutSheet';
