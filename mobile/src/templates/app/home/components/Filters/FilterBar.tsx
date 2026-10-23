import { ScrollView } from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, size, space } from '../../../../../config/tamagui/tokens';
import { Text } from '../../../../../atomic/ds/atoms/Text';
import {
  SpotFilters,
  activeChips,
  filterButtonLabel,
  hasActiveFilters,
  removeChip,
} from '../../../../../domain/spot/filters';

type FilterBarProps = {
  filters: SpotFilters;
  onOpen: () => void;
  /** Remover um chip reaplica na hora. */
  onChange: (filters: SpotFilters) => void;
};

/** Botão "Filtros (n)" e os chips removíveis dos filtros ativos (rolagem horizontal). */
export const FilterBar = ({ filters, onOpen, onChange }: FilterBarProps) => {
  const theme = useTheme();
  const active = hasActiveFilters(filters);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ gap: space[2], alignItems: 'center' }}
    >
      <View
        minHeight={size.controlMd}
        flexDirection="row"
        alignItems="center"
        gap={space[1]}
        paddingHorizontal={space[3]}
        borderRadius={radius.full}
        borderWidth={1.5}
        borderColor={active ? '$primary' : '$border'}
        backgroundColor={active ? '$primarySoft' : '$surface'}
        onPress={onOpen}
        accessible
        accessibilityRole="button"
        accessibilityLabel={filterButtonLabel(filters)}
        testID="filter-button"
      >
        <SlidersHorizontal size={16} color={theme.text.val} />
        <Text variant="label">{filterButtonLabel(filters)}</Text>
      </View>

      {activeChips(filters).map(chip => (
        <View
          key={chip.key}
          minHeight={size.controlMd}
          flexDirection="row"
          alignItems="center"
          gap={space[1]}
          paddingLeft={space[3]}
          paddingRight={space[2]}
          borderRadius={radius.full}
          borderWidth={1.5}
          borderColor="$primary"
          backgroundColor="$primarySoft"
          onPress={() => onChange(removeChip(filters, chip.key))}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Remover filtro ${chip.label}`}
          testID={`filter-chip-${chip.key}`}
        >
          <Text variant="label" tone="primary">
            {chip.label}
          </Text>
          <X size={16} color={theme.primaryText.val} />
        </View>
      ))}
    </ScrollView>
  );
};
