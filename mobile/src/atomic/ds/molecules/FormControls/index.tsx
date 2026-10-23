import { Switch as RNSwitch } from 'react-native';
import { Check } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, size, space } from '../../../../config/tamagui/tokens';
import { Text } from '../../atoms/Text';

type Option = { value: string; label: string };

type SegmentedProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  testID?: string;
};

/** 2 a 4 opções exclusivas, altura 44, selecionado `primary`/`onPrimary`. */
export const Segmented = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  testID,
}: SegmentedProps) => (
  <View gap={space[1]} opacity={disabled ? 0.4 : 1}>
    <Text variant="label">{label}</Text>
    <View
      flexDirection="row"
      borderWidth={1}
      borderColor="$border"
      borderRadius={radius.md}
      overflow="hidden"
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      testID={testID}
    >
      {options.map(option => {
        const selected = option.value === value;
        return (
          <View
            key={option.value}
            flex={1}
            minHeight={size.controlMd}
            alignItems="center"
            justifyContent="center"
            backgroundColor={selected ? '$primary' : '$surface'}
            onPress={disabled ? undefined : () => onChange(option.value)}
            accessible
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled }}
            testID={testID ? `${testID}-${option.value}` : undefined}
          >
            <Text variant="label" tone={selected ? 'onPrimary' : 'default'}>
              {option.label}
            </Text>
          </View>
        );
      })}
    </View>
  </View>
);

type ChoiceChipsProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  testID?: string;
};

/** Chips de escolha única (ex.: modalidade). Selecionado com marcador ✓. */
export const ChoiceChips = ({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  testID,
}: ChoiceChipsProps) => {
  const theme = useTheme();
  return (
    <View gap={space[2]} opacity={disabled ? 0.4 : 1}>
      <Text variant="label">{label}</Text>
      <View
        flexDirection="row"
        flexWrap="wrap"
        gap={space[2]}
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        testID={testID}
      >
        {options.map(option => {
          const selected = option.value === value;
          return (
            <View
              key={option.value}
              minHeight={size.controlMd}
              justifyContent="center"
              onPress={disabled ? undefined : () => onChange(option.value)}
              accessible
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected, disabled }}
              testID={testID ? `${testID}-${option.value}` : undefined}
            >
              <View
                flexDirection="row"
                alignItems="center"
                gap={space[1]}
                height={36}
                paddingHorizontal={space[3]}
                borderRadius={radius.full}
                borderWidth={1.5}
                borderColor={selected ? '$primary' : '$border'}
                backgroundColor={selected ? '$primarySoft' : '$surface'}
              >
                {selected ? <Check size={16} color={theme.primaryText.val} /> : null}
                <Text variant="label" tone={selected ? 'primary' : 'default'}>
                  {option.label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      {error ? (
        <Text variant="bodySm" tone="error" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

type SwitchRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
};

/** Linha com rótulo e Switch (ligado `primary`), alvo 48. */
export const SwitchRow = ({
  label,
  value,
  onChange,
  disabled = false,
  testID,
}: SwitchRowProps) => {
  const theme = useTheme();
  return (
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      minHeight={size.touch}
      gap={space[3]}
    >
      <Text variant="body" flex={1}>
        {label}
      </Text>
      <RNSwitch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: theme.primary.val, false: theme.border.val }}
        thumbColor={theme.surface.val}
        accessibilityLabel={label}
        testID={testID}
      />
    </View>
  );
};

type CheckboxRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
};

/** Checkbox 24 com rótulo; a linha inteira é o alvo (48). */
export const CheckboxRow = ({
  label,
  value,
  onChange,
  disabled = false,
  testID,
}: CheckboxRowProps) => {
  const theme = useTheme();
  return (
    <View
      flexDirection="row"
      alignItems="center"
      gap={space[3]}
      minHeight={size.touch}
      opacity={disabled ? 0.4 : 1}
      onPress={disabled ? undefined : () => onChange(!value)}
      accessible
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      testID={testID}
    >
      <View
        width={24}
        height={24}
        borderRadius={radius.sm}
        borderWidth={2}
        borderColor={value ? '$primary' : '$border'}
        backgroundColor={value ? '$primary' : '$surface'}
        alignItems="center"
        justifyContent="center"
      >
        {value ? <Check size={16} color={theme.onPrimary.val} /> : null}
      </View>
      <Text variant="body" flex={1}>
        {label}
      </Text>
    </View>
  );
};
