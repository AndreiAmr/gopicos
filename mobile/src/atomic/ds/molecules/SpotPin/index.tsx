import { View, useTheme } from 'tamagui';
import {
  fontFamily,
  space,
  sticker,
  stickerShadow,
} from '../../../../config/tamagui/tokens';
import {
  SpotSummary,
  pinA11yLabel,
  pinText,
} from '../../../../domain/spot/spot';
import { Text } from '../../atoms/Text';

type SpotPinProps = {
  spot: SpotSummary;
  selected?: boolean;
  onPress?: () => void;
};

/**
 * Pin sticker "★ 4,6" ou "Novo" (spec home.md 6.6): pílula `surface` com borda
 * `sticker-outline` e sombra rígida. Selecionado: 30 de altura, `primary`,
 * borda 2 `ink`, sombra 3 e giro -3 (a forma muda, não só a cor). Alvo 44.
 */
export const SpotPin = ({ spot, selected = false, onPress }: SpotPinProps) => {
  const theme = useTheme();
  const label = pinText(spot);
  const rated = label.startsWith('★');
  const color = selected ? '$onPrimary' : '$text';
  return (
    <View
      minWidth={44}
      height={44}
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={pinA11yLabel(spot)}
      accessibilityState={{ selected }}
      testID={`spot-pin-${spot.id}`}
    >
      <View
        height={selected ? 30 : 26}
        paddingHorizontal={space[2] + 1}
        borderRadius={selected ? 15 : 13}
        borderWidth={selected ? sticker.borderWidth : 1.5}
        borderColor={selected ? '$ink' : '$stickerOutline'}
        backgroundColor={selected ? '$primary' : '$surface'}
        alignItems="center"
        justifyContent="center"
        rotate={selected ? '-3deg' : '0deg'}
        boxShadow={stickerShadow(
          theme.stickerShadow.val,
          selected ? sticker.shadowOffset : sticker.shadowOffsetSm,
        )}
      >
        <Text
          fontFamily={fontFamily.bold}
          fontSize={selected ? 13 : 12}
          lineHeight={16}
          color={color}
        >
          {rated ? (
            <Text fontFamily={fontFamily.bold} fontSize={selected ? 13 : 12} color={selected ? color : '$star'}>
              ★
            </Text>
          ) : null}
          {rated ? label.slice(1) : label}
        </Text>
      </View>
    </View>
  );
};
