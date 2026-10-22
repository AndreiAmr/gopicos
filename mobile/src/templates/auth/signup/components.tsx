import React from 'react';
import { View } from 'tamagui';
import { radius, space } from '../../../config/tamagui/tokens';
import { Text } from '../../../atomic/ds';

/** Indicador de progresso "Passo n de N" com barras. */
export const Stepper = ({ step, total }: { step: number; total: number }) => (
  <View gap={space[2]}>
    <View
      flexDirection="row"
      gap={space[1]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          flex={1}
          height={4}
          borderRadius={radius.full}
          backgroundColor={i < step ? '$primary' : '$border'}
        />
      ))}
    </View>
    <Text
      variant="bodySm"
      tone="muted"
      accessibilityLabel={`Passo ${step} de ${total}`}
    >
      {`Passo ${step} de ${total}`}
    </Text>
  </View>
);
