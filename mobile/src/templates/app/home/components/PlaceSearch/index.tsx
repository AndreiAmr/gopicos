import { useCallback, useRef, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, X } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  MAX_FONT_SCALE,
  elevation,
  fontFamily,
  radius,
  size,
  space,
  typography,
  zIndex,
} from '../../../../../config/tamagui/tokens';
import { Text } from '../../../../../atomic/ds/atoms/Text';
import { TextLink } from '../../../../../atomic/ds/auth/TextLink';
import {
  Place,
  placeContext,
  placeStrings,
  placeTitle,
} from '../../../../../domain/place/place';
import { usePlaceSearch } from '../../../../../hooks/query/places/usePlaceSearch';

type PlaceSearchProps = {
  /** Lugar escolhido: a Home centraliza o mapa nele. */
  onSelectPlace: (place: Place) => void;
  /** Busca focada (teclado aberto): a Home esconde coluna, toast e sheets (Z7). */
  onFocusChange?: (focused: boolean) => void;
};

const Row = ({ place, onPress }: { place: Place; onPress: () => void }) => {
  const theme = useTheme();
  const context = placeContext(place);

  return (
    <View
      minHeight={56}
      flexDirection="row"
      alignItems="center"
      gap={space[3]}
      paddingHorizontal={space[4]}
      paddingVertical={space[2]}
      onPress={onPress}
      pressStyle={{ backgroundColor: '$sunken' }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={context ? `${placeTitle(place)}, ${context}` : placeTitle(place)}
      testID="place-result"
    >
      <MapPin size={20} color={theme.textMuted.val} />
      <View flex={1}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {placeTitle(place)}
        </Text>
        {context ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {context}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

/**
 * Busca de cidade ou endereço no topo do mapa (spec 9 e 7). Ao focar, o mapa
 * escurece e a lista de sugestões ocupa do campo até o teclado; "Cancelar"
 * restaura o texto anterior; o return do teclado escolhe a primeira sugestão.
 */
export const PlaceSearch = ({ onSelectPlace, onFocusChange }: PlaceSearchProps) => {
  const theme = useTheme();
  const search = usePlaceSearch();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  // Texto do campo antes de focar (restaurado ao cancelar).
  const previousText = useRef('');

  const choose = useCallback(
    (place: Place) => {
      search.commit(place);
      inputRef.current?.blur();
      onSelectPlace(place);
    },
    [onSelectPlace, search],
  );

  const cancel = useCallback(() => {
    search.restore(previousText.current);
    inputRef.current?.blur();
  }, [search]);

  const clear = useCallback(() => {
    search.clear();
    inputRef.current?.focus();
  }, [search]);

  const { status, results } = search;

  return (
    <View
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={focused ? 0 : undefined}
      zIndex={zIndex.header}
      pointerEvents="box-none"
    >
      {focused ? (
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$mapDim"
          onPress={cancel}
          testID="place-search-dim"
        />
      ) : null}

      <SafeAreaView edges={['top']} pointerEvents="box-none" style={{ flex: focused ? 1 : 0 }}>
        <View paddingHorizontal={space[4]} paddingTop={space[2]} gap={space[2]} flex={focused ? 1 : 0}>
          <View flexDirection="row" alignItems="center" gap={space[2]}>
            <View
              flex={1}
              flexDirection="row"
              alignItems="center"
              minHeight={size.touch}
              paddingHorizontal={space[3]}
              gap={space[2]}
              backgroundColor="$surface"
              borderRadius={radius.md}
              borderWidth={focused ? 2 : 1.5}
              borderColor={focused ? '$focus' : '$border'}
              {...elevation[1]}
            >
              <Search size={20} color={theme.textMuted.val} />
              <TextInput
                ref={inputRef}
                value={search.text}
                onChangeText={search.onChangeText}
                onFocus={() => {
                  previousText.current = search.text;
                  setFocused(true);
                  onFocusChange?.(true);
                }}
                onBlur={() => {
                  setFocused(false);
                  onFocusChange?.(false);
                }}
                onSubmitEditing={() => {
                  if (results[0]) choose(results[0]);
                }}
                returnKeyType="search"
                autoCorrect={false}
                placeholder={placeStrings.placeholder}
                placeholderTextColor={theme.textSubtle.val}
                selectionColor={theme.primary.val}
                accessibilityLabel={placeStrings.placeholder}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                testID="place-search-input"
                style={{
                  flex: 1,
                  paddingVertical: space[2],
                  fontSize: typography.body.fontSize,
                  fontFamily: fontFamily.regular,
                  color: theme.text.val,
                }}
              />
              {search.text.length > 0 ? (
                <View
                  width={size.touch}
                  height={size.touch}
                  marginRight={-space[3]}
                  alignItems="center"
                  justifyContent="center"
                  onPress={clear}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={placeStrings.clear}
                  testID="place-search-clear"
                >
                  <X size={20} color={theme.textMuted.val} />
                </View>
              ) : null}
            </View>
            {focused ? (
              <TextLink label={placeStrings.cancel} onPress={cancel} testID="place-search-cancel" />
            ) : null}
          </View>

          {focused ? (
            <View
              flex={1}
              backgroundColor="$surface"
              borderRadius={radius.md}
              overflow="hidden"
              marginBottom={space[2]}
              testID="place-search-list"
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                {status === 'hint' ? (
                  <Text variant="caption" tone="muted" padding={space[4]}>
                    {placeStrings.hint}
                  </Text>
                ) : null}
                {status === 'loading' ? (
                  <Text
                    variant="bodySm"
                    tone="muted"
                    padding={space[4]}
                    accessibilityLiveRegion="polite"
                  >
                    {placeStrings.searching}
                  </Text>
                ) : null}
                {status === 'empty' ? (
                  <Text variant="body" tone="muted" padding={space[4]}>
                    {placeStrings.empty}
                  </Text>
                ) : null}
                {status === 'error' ? (
                  <View padding={space[4]} gap={space[1]} accessibilityRole="alert">
                    <Text variant="body" tone="error">
                      {placeStrings.error}
                    </Text>
                    <TextLink label={placeStrings.retry} onPress={search.retry} />
                  </View>
                ) : null}
                {status === 'ready'
                  ? results.map((place, index) => (
                      <Row
                        key={`${place.lat}-${place.lng}-${index}`}
                        place={place}
                        onPress={() => choose(place)}
                      />
                    ))
                  : null}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};
