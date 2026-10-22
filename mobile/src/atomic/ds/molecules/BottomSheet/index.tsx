import { forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { SheetContent } from '../Sheet';

type BottomSheetProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  /** Chamado quando o sheet fecha (gesto, backdrop ou botão). */
  onClose?: () => void;
  snapPoints?: Array<string | number>;
};

/**
 * Bottom sheet modal arrastável (baseado em @gorhom/bottom-sheet). Fecha por
 * gesto, toque no fundo e botão "X". Exige `BottomSheetModalProvider` na raiz
 * (já presente em `App.tsx`). Controle por ref: `ref.current?.present()` /
 * `ref.current?.dismiss()`.
 */
export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ onClose, snapPoints, ...content }, ref) => {
    const theme = useTheme();

    const handleIndicatorStyle = {
      backgroundColor: theme.border.val,
      width: 40,
    };

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.65}
        />
      ),
      [],
    );

    const handleClose = useCallback(() => {
      if (ref && typeof ref !== 'function') {
        ref.current?.dismiss();
      }
      onClose?.();
    }, [ref, onClose]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={!snapPoints}
        enablePanDownToClose
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.surface.val,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        }}
        handleIndicatorStyle={handleIndicatorStyle}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: space[4],
            paddingBottom: space[8],
            paddingTop: space[2],
          }}
        >
          <SheetContent {...content} onClose={handleClose} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
