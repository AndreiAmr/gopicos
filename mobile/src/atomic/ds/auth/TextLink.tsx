import { Pressable } from 'react-native';
import { size } from '../../../config/tamagui/tokens';
import { Text } from '../atoms/Text';

type TextLinkProps = {
  label: string;
  onPress?: () => void;
  /** Variante de apoio: `bodySm` em `textMuted` (ex.: "Esqueci minha senha"). */
  quiet?: boolean;
  disabled?: boolean;
  testID?: string;
};

/** Link de texto sempre sublinhado, com alvo de toque mínimo de 48. */
export const TextLink = ({
  label,
  onPress,
  quiet = false,
  disabled = false,
  testID,
}: TextLinkProps) => (
  <Pressable
    onPress={disabled ? undefined : onPress}
    accessibilityRole="link"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    hitSlop={8}
    style={({ pressed }) => ({
      minHeight: size.touch,
      justifyContent: 'center',
      opacity: pressed ? 0.8 : 1,
    })}
    testID={testID ?? 'ds-text-link'}
  >
    <Text
      variant={quiet ? 'bodySm' : 'label'}
      tone={disabled ? 'subtle' : quiet ? 'muted' : 'primary'}
      textDecorationLine={disabled ? 'none' : 'underline'}
    >
      {label}
    </Text>
  </Pressable>
);
