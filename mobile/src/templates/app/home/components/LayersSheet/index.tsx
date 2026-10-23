import { forwardRef, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Svg, { Path, Rect, Text as SvgText, G } from 'react-native-svg';
import { Check, X } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  fontFamily,
  mapThumbColors as THUMB,
  radius,
  size,
  space,
  sticker,
  stickerShadow,
} from '../../../../../config/tamagui/tokens';
import { Text } from '../../../../../atomic/ds/atoms/Text';
import { BottomSheet } from '../../../../../atomic/ds/molecules/BottomSheet';
import { BrandTitle } from '../../../../../atomic/ds/brand';
import {
  MAP_LAYER_OPTIONS,
  MapLayer,
  layerStrings,
} from '../../../../../domain/map/layers';


const Thumbnail = ({ layer, dark }: { layer: MapLayer; dark: boolean }) => {
  const theme = useTheme();
  const p =
    layer === 'satellite'
      ? THUMB.satellite
      : layer === 'concrete'
      ? dark
        ? THUMB.concreteNight
        : THUMB.concreteDay
      : dark
      ? THUMB.streetNight
      : THUMB.streetDay;
  return (
    <View
      height={72}
      borderRadius={radius.sm}
      overflow="hidden"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width="100%" height={72} viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice">
        <Rect width={100} height={72} fill={p.land} />
        <Rect x={6} y={6} width={22} height={18} rx={1} fill={p.bld} />
        <Rect x={36} y={4} width={18} height={24} rx={1} fill={p.bld} />
        <Rect x={70} y={42} width={22} height={22} rx={1} fill={p.bld} />
        <Path d="M0 52 C 30 44, 60 60, 100 48" stroke={p.water} strokeWidth={7} fill="none" />
        <Rect x={34} y={40} width={30} height={26} fill={p.park} />
        <Path d="M0 34 H100 M58 0 V72" stroke={p.jcase} strokeWidth={8} />
        <Path d="M0 34 H100 M58 0 V72" stroke={p.major} strokeWidth={5} />
        <G x={22} y={22}>
          <Rect x={2} y={2} width={30} height={16} rx={8} fill={theme.stickerOutline.val} />
          <Rect
            width={30}
            height={16}
            rx={8}
            fill={theme.surface.val}
            stroke={theme.stickerOutline.val}
            strokeWidth={1.2}
          />
          <SvgText
            x={15}
            y={11.5}
            fontSize={8}
            fontWeight="700"
            fill={theme.text.val}
            textAnchor="middle"
          >
            ★ 4,6
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

type LayersSheetProps = {
  layer: MapLayer;
  /** Trocando o estilo: spinner sobre a miniatura escolhida. */
  switching: boolean;
  dark: boolean;
  onChange: (layer: MapLayer) => void;
  bottomInset?: number;
  onClose?: () => void;
};

/**
 * Sheet de camadas (spec home.md 6.5, GP-048): três cartões, escolha única,
 * troca na hora e o sheet continua aberto para comparar (UX-H14).
 */
export const LayersSheet = forwardRef<BottomSheetModal, LayersSheetProps>(
  ({ layer, switching, dark, onChange, bottomInset = 0, onClose }, ref) => {
    const theme = useTheme();
    const close = useCallback(() => {
      if (ref && typeof ref !== 'function') ref.current?.dismiss();
    }, [ref]);

    return (
      <BottomSheet
        ref={ref}
        title={layerStrings.title}
        backdrop="soft"
        bottomInset={bottomInset}
        onClose={onClose}
        renderContent={() => (
          <BottomSheetView
            style={{ paddingHorizontal: space[4], paddingBottom: space[6] }}
            testID="layers-sheet"
          >
            <View flexDirection="row" alignItems="flex-start" justifyContent="space-between">
              <BrandTitle fontSize={28} sprayWidth={110}>
                {layerStrings.title}
              </BrandTitle>
              <View
                width={size.touch}
                height={size.touch}
                marginRight={-space[3]}
                alignItems="center"
                justifyContent="center"
                onPress={close}
                accessible
                accessibilityRole="button"
                accessibilityLabel={layerStrings.close}
                testID="layers-close"
              >
                <X size={22} color={theme.text.val} />
              </View>
            </View>

            <View
              flexDirection="row"
              gap={10}
              marginTop={space[4]}
              accessibilityRole="radiogroup"
              accessibilityLabel={layerStrings.group}
            >
              {MAP_LAYER_OPTIONS.map(option => {
                const selected = option.value === layer;
                return (
                  <View
                    key={option.value}
                    flex={1}
                    minWidth={0}
                    padding={space[2]}
                    paddingBottom={10}
                    borderRadius={12}
                    borderWidth={selected ? sticker.borderWidth : 1.5}
                    borderColor={selected ? '$stickerOutline' : '$border'}
                    backgroundColor="$surface"
                    rotate={selected ? '-2deg' : '0deg'}
                    boxShadow={selected ? stickerShadow(theme.stickerShadow.val) : undefined}
                    onPress={() => onChange(option.value)}
                    accessible
                    accessibilityRole="radio"
                    accessibilityLabel={`${option.label}, ${option.description}`}
                    accessibilityState={{ checked: selected, busy: selected && switching }}
                    testID={`layer-${option.value}`}
                  >
                    <Thumbnail layer={option.value} dark={dark} />
                    {/* Nome numa linha, reduzindo com fonte grande (nunca quebra "Concret/o"). */}
                    <Text
                      fontFamily={fontFamily.semiBold}
                      fontSize={16}
                      marginTop={space[2]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {option.label}
                    </Text>
                    {/* Descrição sem corte: a spec aceita 3 linhas ou mais com fonte grande. */}
                    <Text variant="caption" tone="muted" marginTop={2}>
                      {option.description}
                    </Text>
                    {selected ? (
                      <View
                        position="absolute"
                        top={-9}
                        right={-9}
                        width={26}
                        height={26}
                        borderRadius={radius.full}
                        backgroundColor="$primary"
                        borderWidth={2}
                        borderColor="$ink"
                        alignItems="center"
                        justifyContent="center"
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                        testID="layer-check"
                      >
                        {switching ? (
                          <ActivityIndicator size="small" color={theme.onPrimary.val} />
                        ) : (
                          <Check size={14} color={theme.onPrimary.val} strokeWidth={3} />
                        )}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </BottomSheetView>
        )}
      />
    );
  },
);

LayersSheet.displayName = 'LayersSheet';
