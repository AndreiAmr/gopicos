import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, size, space } from '../../../config/tamagui/tokens';
import { Text } from '../atoms/Text';
import { TextLink } from './TextLink';

export type AlertBannerType = 'error' | 'success' | 'info';

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const;

type AlertBannerProps = {
  type: AlertBannerType;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
  testID?: string;
};

/**
 * Bloco inline que não some sozinho: borda + faixa de acento de 4 px na cor da
 * variante, ícone e texto (nunca só cor). Ação opcional abaixo do texto.
 */
export const AlertBanner = ({
  type,
  message,
  actionLabel,
  onActionPress,
  testID,
}: AlertBannerProps) => {
  const theme = useTheme();
  const Icon = icons[type];
  const color = theme[type].val;

  return (
    <View
      flexDirection="row"
      backgroundColor="$sunken"
      borderRadius={radius.md}
      borderWidth={1.5}
      borderColor={color}
      overflow="hidden"
      accessible
      accessibilityRole={type === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion={type === 'error' ? 'assertive' : 'polite'}
      accessibilityLabel={message}
      testID={testID ?? `ds-alert-banner-${type}`}
    >
      <View width={4} backgroundColor={color} />
      <View flex={1} padding={space[3]} gap={space[1]}>
        <View flexDirection="row" gap={space[2]}>
          <Icon size={20} color={color} />
          <Text variant="bodySm" flex={1}>
            {message}
          </Text>
        </View>
        {actionLabel && onActionPress ? (
          <View paddingLeft={space[2] + 20} minHeight={size.touch}>
            <TextLink label={actionLabel} onPress={onActionPress} />
          </View>
        ) : null}
      </View>
    </View>
  );
};
