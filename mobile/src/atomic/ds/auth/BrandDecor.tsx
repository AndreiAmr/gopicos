import { Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { View, useTheme } from 'tamagui';
import { space } from '../../../config/tamagui/tokens';
import Logo from '../../../assets/images/logo.png';
import { Text } from '../atoms/Text';

/** Fita de sinalização decorativa no canto superior esquerdo. */
export const Tape = () => (
  <View
    position="absolute"
    top={space[4]}
    left={-space[8]}
    width={140}
    height={14}
    backgroundColor="$primary"
    opacity={0.85}
    rotate="-35deg"
    pointerEvents="none"
    importantForAccessibility="no-hide-descendants"
    accessibilityElementsHidden
    testID="ds-tape"
  />
);

/** Padrão de meio-tom decorativo no canto superior direito. */
export const Halftone = () => {
  const theme = useTheme();
  const dots = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      dots.push(
        <Circle
          key={`${row}-${col}`}
          cx={8 + col * 16}
          cy={8 + row * 16}
          r={Math.max(1, 5 - (row + (4 - col)) * 0.6)}
          fill={theme.primary.val}
        />,
      );
    }
  }

  return (
    <View
      position="absolute"
      top={space[4]}
      right={space[4]}
      opacity={0.5}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      testID="ds-halftone"
    >
      <Svg width={80} height={80}>
        {dots}
      </Svg>
    </View>
  );
};

/** Marca: logo (placeholder aprovado pelo dono) + "GoPicos". */
export const Wordmark = () => (
  <View
    flexDirection="row"
    alignItems="center"
    gap={space[2]}
    accessible
    accessibilityLabel="GoPicos"
    testID="ds-wordmark"
  >
    <Image source={Logo} style={{ width: 40, height: 40 }} />
    <Text variant="display">GoPicos</Text>
  </View>
);
