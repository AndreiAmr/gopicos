import { DimensionValue } from 'react-native';
import { View } from 'tamagui';
import { radius } from '../../../../config/tamagui/tokens';
import { dsStrings } from '../../strings';

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  /** Formato: `line` (texto), `block` (imagem/card) ou `circle` (avatar). */
  shape?: 'line' | 'block' | 'circle';
  testID?: string;
};

/**
 * Placeholder de carregamento em `sunken`. Estático de propósito: o DS não
 * permite animação decorativa contínua e isso respeita "reduzir movimento".
 */
export const Skeleton = ({
  width = '100%',
  height,
  shape = 'line',
  testID,
}: SkeletonProps) => {
  const resolvedHeight = height ?? (shape === 'line' ? 16 : 96);
  const borderRadius =
    shape === 'circle' ? radius.full : shape === 'line' ? radius.sm : radius.md;

  return (
    <View
      backgroundColor="$sunken"
      width={width}
      height={resolvedHeight}
      borderRadius={borderRadius}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={dsStrings.loading}
      accessibilityState={{ busy: true }}
      testID={testID ?? 'ds-skeleton'}
    />
  );
};
