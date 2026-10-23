import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  fontFamily,
  radius,
  size,
  space,
  sticker,
  stickerShadow,
} from '../../../../../config/tamagui/tokens';
import { Text } from '../../../../../atomic/ds/atoms/Text';
import { SpinningWheel } from '../../../../../atomic/ds/brand';
import {
  SpotFilters,
  activeChips,
  activeFilterCount,
  filterButtonLabel,
  filterStrings,
  removeChip,
} from '../../../../../domain/spot/filters';

type FilterButtonProps = {
  filters: SpotFilters;
  /** Aplicando: spinner no lugar do ícone, mesma largura. */
  loading?: boolean;
  onOpen: () => void;
};

/**
 * Botão "Filtros" sticker (spec home.md 6.1): com filtro ativo fica amarelo
 * com selo `ink` e o número em amarelo (nunca só cor: selo + número).
 */
export const FilterButton = ({ filters, loading = false, onOpen }: FilterButtonProps) => {
  const theme = useTheme();
  const count = activeFilterCount(filters);
  const active = count > 0;
  const [pressed, setPressed] = useState(false);
  const shift = pressed ? 2 : 0;
  const textColor = active ? '$ink' : '$text';
  const iconColor = active ? theme.ink.val : theme.text.val;

  return (
    <View
      minHeight={size.touch}
      flexDirection="row"
      alignItems="center"
      gap={space[2]}
      paddingHorizontal={14}
      borderRadius={radius.sm}
      borderWidth={sticker.borderWidth}
      borderColor={active ? '$ink' : '$stickerOutline'}
      backgroundColor={active ? '$brandYellow' : '$surface'}
      boxShadow={stickerShadow(theme.stickerShadow.val, pressed ? 1 : sticker.shadowOffset)}
      transform={[{ translateX: shift }, { translateY: shift }]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onOpen}
      accessible
      accessibilityRole="button"
      accessibilityLabel={filterButtonLabel(filters)}
      accessibilityState={{ busy: loading }}
      testID="filter-button"
    >
      {loading ? (
        <SpinningWheel size={20} color={iconColor} />
      ) : (
        <SlidersHorizontal size={20} color={iconColor} />
      )}
      <Text fontFamily={fontFamily.semiBold} fontSize={16} lineHeight={20} color={textColor}>
        {filterStrings.button}
      </Text>
      {active ? (
        <View
          minWidth={20}
          height={20}
          paddingHorizontal={5}
          borderRadius={radius.full}
          backgroundColor="$ink"
          alignItems="center"
          justifyContent="center"
          testID="filter-badge"
        >
          <Text fontFamily={fontFamily.bold} fontSize={12} lineHeight={14} color="$brandYellow">
            {count}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

type ActiveChipsProps = {
  filters: SpotFilters;
  /** Remover um chip reaplica na hora. */
  onChange: (filters: SpotFilters) => void;
};

/**
 * Chips dos filtros ativos (spec 6.2): stickers amarelos com giro alternado,
 * alvo 44, rolagem horizontal. Sem filtro, não renderiza nada.
 */
export const ActiveChips = ({ filters, onChange }: ActiveChipsProps) => {
  const theme = useTheme();
  const chips = activeChips(filters);
  if (chips.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      // Margem para a sombra e o giro não serem cortados.
      contentContainerStyle={{
        gap: 10,
        alignItems: 'center',
        paddingHorizontal: space[4],
        paddingVertical: 4,
      }}
      testID="filter-chips"
    >
      {chips.map((chip, index) => (
        <View
          key={chip.key}
          minHeight={size.controlMd}
          justifyContent="center"
          onPress={() => onChange(removeChip(filters, chip.key))}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Remover filtro ${chip.label}`}
          testID={`filter-chip-${chip.key}`}
        >
          <View
            flexDirection="row"
            alignItems="center"
            gap={6}
            height={36}
            paddingLeft={space[3]}
            paddingRight={space[2]}
            borderRadius={4}
            borderWidth={sticker.borderWidth}
            borderColor="$ink"
            backgroundColor="$brandYellow"
            rotate={index % 2 === 0 ? '-1deg' : '1deg'}
            boxShadow={stickerShadow(theme.stickerShadow.val, sticker.shadowOffsetSm)}
          >
            <Text fontFamily={fontFamily.semiBold} fontSize={14} lineHeight={18} color="$ink">
              {chip.label}
            </Text>
            <X size={16} color={theme.ink.val} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
