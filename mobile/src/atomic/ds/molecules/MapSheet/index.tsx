import { ReactNode, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import GorhomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { SharedValue } from 'react-native-reanimated';
import { useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';

type MapSheetProps = {
  /** Aberto (peek) ou fechado; controlado pela tela. */
  open: boolean;
  /** Fechou por gesto: a tela atualiza o estado. */
  onClose: () => void;
  children: ReactNode;
  /** Pontos fixos (ex.: [peek, '60%']); sem eles, a altura é a do conteúdo. */
  snapPoints?: Array<string | number>;
  topInset?: number;
  animatedPosition?: SharedValue<number>;
  accessibilityLabel: string;
  testID?: string;
};

/**
 * Sheet não modal da Home (resumo do pico e vazio, spec home.md 6.7): fica
 * dentro da tela do mapa, sem véu (o mapa continua usável) e acima da tab
 * bar. Some sozinho ao navegar para outra tela.
 */
export const MapSheet = ({
  open,
  onClose,
  children,
  snapPoints,
  topInset = 0,
  animatedPosition,
  accessibilityLabel,
  testID,
}: MapSheetProps) => {
  const theme = useTheme();
  const ref = useRef<GorhomSheet>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (open) {
      ref.current?.snapToIndex(0);
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <GorhomSheet
      ref={ref}
      index={open ? 0 : -1}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      enablePanDownToClose
      topInset={topInset}
      animatedPosition={animatedPosition}
      onChange={index => {
        if (index === -1 && openRef.current) {
          onClose();
        }
      }}
      backgroundStyle={{
        backgroundColor: theme.surface.val,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
      }}
      handleIndicatorStyle={[styles.handle, { backgroundColor: theme.border.val }]}
      style={[styles.shadow, { shadowColor: theme.ink.val }]}
      accessibilityLabel={accessibilityLabel}
    >
      <BottomSheetView
        style={{ paddingHorizontal: space[4], paddingBottom: space[4], paddingTop: space[2] }}
        testID={testID}
      >
        {children}
      </BottomSheetView>
    </GorhomSheet>
  );
};

const styles = StyleSheet.create({
  handle: { width: 36 },
  shadow: {
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
});
