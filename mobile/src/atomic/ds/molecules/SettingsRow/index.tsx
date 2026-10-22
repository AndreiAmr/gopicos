import { ReactNode } from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Text } from '../../atoms/Text';

type SettingsRowProps = {
  icon: LucideIcon;
  label: string;
  /** Valor/descrição à direita do rótulo (ex.: nome completo). */
  value?: string;
  onPress?: () => void;
  /** Variante destrutiva: ícone e rótulo em `error`. */
  destructive?: boolean;
  /** Mostra o chevron de navegação (padrão: sim). */
  chevron?: boolean;
  disabled?: boolean;
  isLast?: boolean;
  testID?: string;
};

/** Linha de ajustes (mín. 56 de altura): ícone, rótulo, valor opcional e chevron. */
export const SettingsRow = ({
  icon: Icon,
  label,
  value,
  onPress,
  destructive = false,
  chevron = true,
  disabled = false,
  isLast = false,
  testID,
}: SettingsRowProps) => {
  const theme = useTheme();
  const iconColor = destructive ? theme.error.val : theme.textMuted.val;

  return (
    <View
      flexDirection="row"
      alignItems="center"
      gap={space[3]}
      minHeight={56}
      paddingHorizontal={space[4]}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomColor="$divider"
      opacity={disabled ? 0.4 : 1}
      pressStyle={{ backgroundColor: '$sunken' }}
      onPress={disabled ? undefined : onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityState={{ disabled }}
      testID={testID}
    >
      <Icon size={24} color={iconColor} />
      <View flex={1}>
        <Text variant="bodyStrong" tone={destructive ? 'error' : 'default'}>
          {label}
        </Text>
        {value ? (
          <Text variant="bodySm" tone="muted" numberOfLines={1}>
            {value}
          </Text>
        ) : null}
      </View>
      {chevron ? <ChevronRight size={20} color={theme.textSubtle.val} /> : null}
    </View>
  );
};

type SettingsGroupProps = {
  children: ReactNode;
};

/** Grupo de linhas: `surface`, raio `lg` e divisórias entre as linhas. */
export const SettingsGroup = ({ children }: SettingsGroupProps) => (
  <View
    backgroundColor="$surface"
    borderRadius={radius.lg}
    borderWidth={1}
    borderColor="$divider"
    overflow="hidden"
  >
    {children}
  </View>
);
