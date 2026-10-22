import { ReactNode, useState } from 'react';
import { ActivityIndicator, TextInput, TextInputProps } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  MAX_FONT_SCALE,
  fontFamily,
  radius,
  size,
  space,
} from '../../../../config/tamagui/tokens';
import { Text } from '../Text';

type InputProps = Omit<TextInputProps, 'style' | 'editable'> & {
  /** Rótulo sempre visível acima do campo (nunca só placeholder). */
  label: string;
  /** Mensagem de erro; ativa borda `error` + ícone + texto. */
  error?: string;
  /** Texto de apoio abaixo do campo (ocultado quando há erro). */
  hint?: string;
  disabled?: boolean;
  /** Mostra spinner à direita e bloqueia edição (ex.: validando no servidor). */
  loading?: boolean;
  /** Elemento à direita (ex.: botão de mostrar senha). */
  right?: ReactNode;
};

/**
 * Campo de texto do DS: altura 48, fonte 16, borda `border` (3:1), foco com
 * anel `focus` de 2 px e erro com borda `error` + ícone + mensagem.
 */
export const Input = ({
  label,
  error,
  hint,
  disabled = false,
  loading = false,
  right,
  onFocus,
  onBlur,
  testID,
  ...rest
}: InputProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    flex: 1,
    paddingVertical: space[2],
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: theme.text.val,
  };

  const hasError = Boolean(error);
  const borderColor = hasError
    ? theme.error.val
    : focused
    ? theme.focus.val
    : theme.border.val;
  // Borda 1 px normal; 2 px no foco/erro para não depender só da cor.
  const borderWidth = focused || hasError ? 2 : 1;

  return (
    <View gap={space[1]} opacity={disabled ? 0.4 : 1}>
      <Text variant="label">{label}</Text>
      <View
        flexDirection="row"
        alignItems="center"
        minHeight={size.touch}
        paddingHorizontal={space[3]}
        gap={space[2]}
        backgroundColor="$surface"
        borderRadius={radius.md}
        borderColor={borderColor}
        borderWidth={borderWidth}
        testID="ds-input-container"
      >
        <TextInput
          {...rest}
          testID={testID ?? 'ds-input'}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          accessibilityState={{ disabled: disabled || loading, busy: loading }}
          editable={!disabled && !loading}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          placeholderTextColor={theme.textSubtle.val}
          selectionColor={theme.primary.val}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={inputStyle}
        />
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary.val} />
        ) : (
          right
        )}
      </View>
      {hasError ? (
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[1]}
          accessibilityRole="alert"
          testID="ds-input-error"
        >
          <AlertCircle size={16} color={theme.error.val} />
          <Text variant="bodySm" tone="error" flex={1}>
            {error}
          </Text>
        </View>
      ) : hint ? (
        <Text variant="bodySm" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
};
