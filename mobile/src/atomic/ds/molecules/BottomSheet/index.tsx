import { ReactNode, forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { SharedValue } from 'react-native-reanimated';
import { useTheme, useThemeName } from 'tamagui';
import { mapDimOpacity, radius, space } from '../../../../config/tamagui/tokens';
import { SheetContent } from '../Sheet';

/** `dim`: véu `map-dim`; `soft`: véu leve (camadas, o mapa muda atrás); `none`: sem véu. */
export type SheetBackdrop = 'dim' | 'soft' | 'none';

type BottomSheetProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  /** Chamado quando o sheet fecha (gesto, backdrop ou botão). */
  onClose?: () => void;
  closeLabel?: string;
  brandTitle?: boolean;
  titleAccessory?: ReactNode;
  snapPoints?: Array<string | number>;
  /**
   * Escurece o fundo e fecha ao toque fora. Desligue para sheets que
   * acompanham conteúdo persistente da tela (ex.: estado vazio da Home), em
   * que o fundo precisa continuar visível e utilizável.
   */
  withBackdrop?: boolean;
  backdrop?: SheetBackdrop;
  /**
   * Distância da base da tela (altura da tab bar): o sheet e o véu ficam
   * acima dela e nunca a cobrem (spec home.md Z5/Z6).
   */
  bottomInset?: number;
  /** Topo máximo do sheet expandido (`insets.top + 8`). */
  topInset?: number;
  /** Posição do topo do sheet, para quem precisa acompanhá-lo. */
  animatedPosition?: SharedValue<number>;
  /** Conteúdo próprio no lugar de título + corpo + ações (ex.: filtros). */
  renderContent?: () => ReactNode;
  enableDynamicSizing?: boolean;
  maxDynamicContentSize?: number;
  footerComponent?: React.ComponentProps<typeof BottomSheetModal>['footerComponent'];
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Bottom sheet modal arrastável (baseado em @gorhom/bottom-sheet). Fecha por
 * gesto, toque no fundo e botão "X". Exige `BottomSheetModalProvider` na raiz
 * (já presente em `App.tsx`). Controle por ref: `ref.current?.present()` /
 * `ref.current?.dismiss()`.
 */
export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  (
    {
      onClose,
      snapPoints,
      withBackdrop = true,
      backdrop,
      bottomInset = 0,
      topInset = 0,
      animatedPosition,
      renderContent,
      enableDynamicSizing,
      maxDynamicContentSize,
      footerComponent,
      accessibilityLabel,
      testID,
      ...content
    },
    ref,
  ) => {
    const theme = useTheme();
    const themeName = useThemeName();
    const mode: SheetBackdrop = backdrop ?? (withBackdrop ? 'dim' : 'none');
    const opacity =
      mode === 'soft'
        ? mapDimOpacity.soft
        : themeName.startsWith('dark')
        ? mapDimOpacity.dark
        : mapDimOpacity.light;

    const handleIndicatorStyle = {
      backgroundColor: theme.border.val,
      width: 40,
    };

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          // O véu cobre mapa e topo, nunca a tab bar.
          style={[props.style, { bottom: bottomInset }]}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={opacity}
        />
      ),
      [bottomInset, opacity],
    );

    const handleClose = useCallback(() => {
      if (ref && typeof ref !== 'function') {
        ref.current?.dismiss();
      }
    }, [ref]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing ?? !snapPoints}
        maxDynamicContentSize={maxDynamicContentSize}
        enablePanDownToClose
        // O sheet sobe com o teclado e o campo focado continua visível.
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onDismiss={onClose}
        bottomInset={bottomInset}
        topInset={topInset}
        animatedPosition={animatedPosition}
        footerComponent={footerComponent}
        backdropComponent={mode === 'none' ? undefined : renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.surface.val,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        }}
        handleIndicatorStyle={handleIndicatorStyle}
        accessibilityLabel={accessibilityLabel ?? content.title}
      >
        {renderContent ? (
          renderContent()
        ) : (
          <BottomSheetView
            style={{
              paddingHorizontal: space[4],
              paddingBottom: space[8],
              paddingTop: space[2],
            }}
            testID={testID}
          >
            <SheetContent {...content} onClose={handleClose} />
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
