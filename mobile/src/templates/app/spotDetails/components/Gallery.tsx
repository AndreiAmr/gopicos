import { useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { ImageIcon, RefreshCw } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { galleryCounter } from '../../../../domain/spot/details';
import { spotDetailsStrings } from '../strings';

export const GALLERY_HEIGHT = 260;

type PhotoProps = { uri: string; width: number };

/** Foto com fallback: tile `sunken` e toque para recarregar. */
const Photo = ({ uri, width }: PhotoProps) => {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (failed) {
    return (
      <View
        width={width}
        height={GALLERY_HEIGHT}
        backgroundColor="$sunken"
        alignItems="center"
        justifyContent="center"
        gap={space[2]}
        onPress={() => {
          setFailed(false);
          setAttempt(value => value + 1);
        }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${spotDetailsStrings.photoFailed}. Toque para recarregar`}
        testID="gallery-photo-failed"
      >
        <RefreshCw size={24} color={theme.textMuted.val} />
        <Text variant="bodySm" tone="muted">
          {spotDetailsStrings.photoFailed}
        </Text>
      </View>
    );
  }

  return (
    <Image
      key={attempt}
      source={{ uri }}
      style={{ width, height: GALLERY_HEIGHT }}
      resizeMode="cover"
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
    />
  );
};

type GalleryProps = { images: string[]; spotName: string };

/** Galeria com swipe horizontal e contador "1 / 4". */
export const Gallery = ({ images, spotName }: GalleryProps) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <View
        height={GALLERY_HEIGHT}
        backgroundColor="$sunken"
        alignItems="center"
        justifyContent="center"
        gap={space[2]}
        testID="gallery-empty"
      >
        <ImageIcon size={32} color={theme.textSubtle.val} />
        <Text variant="bodySm" tone="muted">
          {spotDetailsStrings.noPhotos}
        </Text>
      </View>
    );
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View height={GALLERY_HEIGHT} accessibilityLabel={`Fotos de ${spotName}`}>
      <FlatList
        data={images}
        keyExtractor={(uri, i) => `${i}-${uri}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => <Photo uri={item} width={width} />}
        testID="gallery-list"
      />
      {images.length > 1 ? (
        <View
          position="absolute"
          right={space[4]}
          bottom={space[3]}
          paddingHorizontal={space[2]}
          paddingVertical={space[1]}
          borderRadius={radius.full}
          backgroundColor="$surface"
        >
          <Text variant="caption" accessibilityLabel={`Foto ${index + 1} de ${images.length}`}>
            {galleryCounter(index, images.length)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
