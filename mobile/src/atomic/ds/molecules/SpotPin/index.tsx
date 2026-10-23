import { View } from 'tamagui';
import { elevation, radius, space } from '../../../../config/tamagui/tokens';
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
 * Marcador em pílula "★ 4,6" (ou "Novo"). Selecionado: fundo `primary`, texto
 * `onPrimary` e altura maior. A área de toque é 44 (maior que o desenho).
 */
export const SpotPin = ({ spot, selected = false, onPress }: SpotPinProps) => (
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
      paddingHorizontal={space[2]}
      borderRadius={radius.full}
      borderWidth={1.5}
      borderColor={selected ? '$text' : '$border'}
      backgroundColor={selected ? '$primary' : '$surface'}
      alignItems="center"
      justifyContent="center"
      {...elevation[1]}
    >
      <Text variant="caption" tone={selected ? 'onPrimary' : 'default'}>
        {pinText(spot)}
      </Text>
    </View>
  </View>
);
