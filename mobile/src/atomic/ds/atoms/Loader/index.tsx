import { ActivityIndicator } from 'react-native';
import { View, useTheme } from 'tamagui';
import { space } from '../../../../config/tamagui/tokens';
import { dsStrings } from '../../strings';
import { Text } from '../Text';

type LoaderProps = {
  /** `sm` para dentro de botões, `lg` para o mapa/tela cheia. */
  size?: 'sm' | 'lg';
  /** Texto visível abaixo do spinner (também usado como rótulo de acessibilidade). */
  label?: string;
  /** Cor do spinner; por padrão `primary`. */
  tone?: 'primary' | 'onPrimary' | 'text';
  testID?: string;
};

/**
 * Indicador de carregamento. Para listas e cards prefira `Skeleton`; o Loader
 * de tela cheia fica restrito ao mapa (DS seção 8).
 */
export const Loader = ({
  size = 'lg',
  label,
  tone = 'primary',
  testID,
}: LoaderProps) => {
  const theme = useTheme();

  return (
    <View
      alignItems="center"
      justifyContent="center"
      gap={space[2]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? dsStrings.loading}
      accessibilityState={{ busy: true }}
      testID={testID ?? 'ds-loader'}
    >
      <ActivityIndicator
        size={size === 'sm' ? 'small' : 'large'}
        color={theme[tone].val}
      />
      {label ? (
        <Text variant="bodySm" tone="muted">
          {label}
        </Text>
      ) : null}
    </View>
  );
};
