import { View } from 'tamagui';
import { space } from '../../../../config/tamagui/tokens';
import { Text } from '../../atoms/Text';

type InfoRowProps = {
  label: string;
  value: string;
  /** Sem divisor (último item da lista). */
  last?: boolean;
};

/** Linha rótulo (muted, 14) + valor (forte, 14), altura mínima 44, divisor `divider`. */
export const InfoRow = ({ label, value, last = false }: InfoRowProps) => (
  <View
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    gap={space[3]}
    minHeight={44}
    paddingVertical={space[2]}
    borderBottomWidth={last ? 0 : 1}
    borderColor="$divider"
    accessible
    accessibilityLabel={`${label}: ${value}`}
  >
    <Text variant="bodySm" tone="muted">
      {label}
    </Text>
    <Text variant="label" flexShrink={1} align="right">
      {value}
    </Text>
  </View>
);
