import { ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, styled, useTheme } from 'tamagui';
import { radius, size, space } from '../../../../config/tamagui/tokens';
import { Text } from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'lg' | 'md';

const Frame = styled(View, {
  name: 'GPButton',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[2],
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: 'transparent',
  paddingHorizontal: space[5],

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        pressStyle: { backgroundColor: '$primaryHover', scale: 0.98 },
      },
      secondary: {
        backgroundColor: '$surface',
        borderColor: '$border',
        pressStyle: { backgroundColor: '$sunken', scale: 0.98 },
      },
      ghost: {
        backgroundColor: 'transparent',
        pressStyle: { backgroundColor: '$primarySoft', scale: 0.98 },
      },
      destructive: {
        backgroundColor: '$error',
        pressStyle: { opacity: 0.85, scale: 0.98 },
      },
    },
    size: {
      lg: { minHeight: size.controlLg },
      md: { minHeight: size.controlMd },
    },
    fullWidth: {
      true: { alignSelf: 'stretch' },
    },
    disabled: {
      true: { opacity: 0.4 },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
    size: 'lg',
  },
});

const labelTone = {
  primary: 'onPrimary',
  secondary: 'default',
  ghost: 'primary',
  destructive: 'onPrimary',
} as const;

/** Chave do tema usada pelo spinner/ícones, alinhada ao `tone` do rótulo. */
const spinnerColor = {
  primary: 'onPrimary',
  secondary: 'text',
  ghost: 'primaryText',
  destructive: 'onPrimary',
} as const;

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Troca o rótulo por spinner, mantém a largura e bloqueia o toque. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Botão do DS. Estados: default, pressed (`pressStyle`), disabled (opacidade
 * 0.4) e loading (spinner sobre o rótulo, que continua ocupando espaço para
 * não alterar a largura).
 */
export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size: buttonSize = 'lg',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  accessibilityLabel,
  testID,
}: ButtonProps) => {
  const theme = useTheme();
  const blocked = disabled || loading;

  return (
    <Frame
      variant={variant}
      size={buttonSize}
      fullWidth={fullWidth}
      disabled={disabled}
      onPress={() => {
        if (!blocked) {
          onPress?.();
        }
      }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: blocked, busy: loading }}
      testID={testID ?? 'ds-button'}
    >
      <View
        flexDirection="row"
        alignItems="center"
        gap={space[2]}
        opacity={loading ? 0 : 1}
      >
        {leftIcon}
        <Text variant="button" tone={labelTone[variant]}>
          {label}
        </Text>
      </View>
      {loading ? (
        <View position="absolute" testID="ds-button-spinner">
          <ActivityIndicator
            size="small"
            color={theme[spinnerColor[variant]].val}
          />
        </View>
      ) : null}
    </Frame>
  );
};
