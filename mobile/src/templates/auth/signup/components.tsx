import React from 'react';
import { Pressable } from 'react-native';
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

/** Aviso de erro que exige ação (não some sozinho). */
export const AlertBanner = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <View
    gap={space[2]}
    padding={space[3]}
    borderRadius={radius.md}
    borderWidth={1}
    borderColor="$error"
    backgroundColor="$surface"
    accessibilityRole="alert"
    testID="signup-banner"
  >
    <Text variant="bodySm" tone="error">
      {message}
    </Text>
    {actionLabel && onAction ? (
      <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
        <Text variant="bodyStrong" tone="primary">
          {actionLabel}
        </Text>
      </Pressable>
    ) : null}
  </View>
);
