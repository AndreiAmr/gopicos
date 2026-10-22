import { Image } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Text } from '../../atoms/Text';

export type PhotoItem = { uri: string; name: string };

type PhotoPickerProps = {
  label: string;
  photos: PhotoItem[];
  max: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
  /** "2 de 5 fotos". */
  counter: string;
  error?: string;
  disabled?: boolean;
};

const TILE_HEIGHT = 100;

/**
 * Grade de 3 colunas com miniaturas de 100, tile "+ Adicionar" tracejado,
 * remover (X 28 com alvo 44) e selo "Capa" na primeira foto.
 */
export const PhotoPicker = ({
  label,
  photos,
  max,
  onAdd,
  onRemove,
  counter,
  error,
  disabled = false,
}: PhotoPickerProps) => {
  const theme = useTheme();

  return (
    <View gap={space[2]}>
      <View flexDirection="row" justifyContent="space-between" gap={space[2]}>
        <Text variant="label" flex={1}>
          {label}
        </Text>
        <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
          {counter}
        </Text>
      </View>
      <View flexDirection="row" flexWrap="wrap" marginHorizontal={-space[1]}>
        {photos.map((photo, index) => (
          <View key={`${photo.uri}-${index}`} width="33.33%" padding={space[1]}>
            <View
              height={TILE_HEIGHT}
              borderRadius={radius.md}
              overflow="hidden"
              backgroundColor="$sunken"
            >
              <Image
                source={{ uri: photo.uri }}
                style={{ width: '100%', height: TILE_HEIGHT }}
                accessibilityIgnoresInvertColors
              />
              {index === 0 ? (
                <View
                  position="absolute"
                  left={space[1]}
                  bottom={space[1]}
                  paddingHorizontal={space[2]}
                  borderRadius={radius.full}
                  backgroundColor="$surface"
                >
                  <Text variant="caption">Capa</Text>
                </View>
              ) : null}
              {!disabled ? (
                <View
                  position="absolute"
                  top={0}
                  right={0}
                  width={44}
                  height={44}
                  alignItems="center"
                  justifyContent="center"
                  onPress={() => onRemove(index)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Remover foto ${index + 1}`}
                  testID={`photo-remove-${index}`}
                >
                  <View
                    width={28}
                    height={28}
                    borderRadius={radius.full}
                    backgroundColor="$surface"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <X size={16} color={theme.text.val} />
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        ))}
        {photos.length < max ? (
          <View width="33.33%" padding={space[1]}>
            <View
              height={TILE_HEIGHT}
              borderRadius={radius.md}
              borderWidth={1.5}
              borderStyle="dashed"
              borderColor={error ? '$error' : '$border'}
              alignItems="center"
              justifyContent="center"
              gap={space[1]}
              opacity={disabled ? 0.4 : 1}
              onPress={disabled ? undefined : onAdd}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Adicionar foto"
              testID="photo-add"
            >
              <Plus size={24} color={theme.primaryText.val} />
              <Text variant="caption" tone="primary">
                Adicionar
              </Text>
            </View>
          </View>
        ) : null}
      </View>
      {error ? (
        <Text variant="bodySm" tone="error" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
