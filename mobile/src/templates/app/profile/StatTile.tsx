import { View } from 'tamagui';
import { radius, space } from '../../../config/tamagui/tokens';
import { Text } from '../../../atomic/ds';

type StatTileProps = {
  /** Contagem; ausente (falha ou ainda sem dado) mostra só o rótulo, nunca um "0" falso (UX-P13). */
  count?: number | null;
  label: string;
  a11yLabel: string;
  onPress: () => void;
  testID?: string;
};

/** Tile tocável com número e rótulo ("Picos", "Avaliações"); alvo >= 64 de altura. */
export const StatTile = ({
  count,
  label,
  a11yLabel,
  onPress,
  testID,
}: StatTileProps) => (
  <View
    flex={1}
    minHeight={64}
    alignItems="center"
    justifyContent="center"
    paddingVertical={space[3]}
    backgroundColor="$surface"
    borderRadius={radius.lg}
    borderWidth={1}
    borderColor="$divider"
    pressStyle={{ backgroundColor: '$sunken' }}
    onPress={onPress}
    accessible
    accessibilityRole="button"
    accessibilityLabel={a11yLabel}
    testID={testID}
  >
    {typeof count === 'number' ? <Text variant="h2">{count}</Text> : null}
    <Text variant="bodySm" tone="muted">
      {label}
    </Text>
  </View>
);
