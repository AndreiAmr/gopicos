import { useState } from 'react';
import { Image } from 'react-native';
import { ImageIcon } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import {
  SpotSummary,
  cardA11yLabel,
  modalityLabel,
  ratingText,
} from '../../../../domain/spot/spot';
import { Skeleton } from '../../atoms/Skeleton';
import { StarRating } from '../../atoms/StarRating';
import { Text } from '../../atoms/Text';

const PHOTO = 72;

type SpotCardProps = {
  spot: SpotSummary;
  /** Toque no card inteiro (normalmente abre o detalhe). */
  onPress?: () => void;
  /** Conteúdo extra abaixo das informações (ex.: distância e "Ver detalhes" no SpotPreview). */
  footer?: React.ReactNode;
  /** Remove a borda/fundo quando o card é embutido em outra superfície. */
  bare?: boolean;
  testID?: string;
};

/** Esqueleto do card: foto e três barras. */
export const SpotCardSkeleton = ({ testID }: { testID?: string }) => (
  <View
    flexDirection="row"
    gap={space[3]}
    padding={space[3]}
    minHeight={96}
    backgroundColor="$surface"
    borderRadius={radius.lg}
    borderWidth={1}
    borderColor="$divider"
    testID={testID ?? 'spot-card-skeleton'}
  >
    <Skeleton width={PHOTO} height={PHOTO} shape="block" />
    <View flex={1} gap={space[2]} justifyContent="center">
      <Skeleton width="70%" height={16} />
      <Skeleton width="40%" height={16} />
      <Skeleton width="55%" height={12} />
    </View>
  </View>
);

/**
 * Card compacto de pico (lista, resumo do mapa, "Meus picos"). Foto 72x72
 * (tile `sunken` com ícone sem foto ou em falha), nome em até 2 linhas, chip de
 * modalidade e nota. O card inteiro é o alvo de toque (>= 96 de altura).
 */
export const SpotCard = ({
  spot,
  onPress,
  footer,
  bare = false,
  testID,
}: SpotCardProps) => {
  const theme = useTheme();
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = spot.images?.[0];
  const showPhoto = Boolean(photo) && !photoFailed;

  return (
    <View
      minHeight={96}
      padding={space[3]}
      gap={space[2]}
      backgroundColor={bare ? 'transparent' : '$surface'}
      borderRadius={radius.lg}
      borderWidth={bare ? 0 : 1}
      borderColor="$divider"
      pressStyle={onPress ? { scale: 0.98, backgroundColor: '$sunken' } : undefined}
      onPress={onPress}
      accessible
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={cardA11yLabel(spot)}
      testID={testID ?? `spot-card-${spot.id}`}
    >
      <View flexDirection="row" gap={space[3]}>
        <View
          width={PHOTO}
          height={PHOTO}
          borderRadius={radius.md}
          backgroundColor="$sunken"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          {showPhoto ? (
            <Image
              source={{ uri: photo as string }}
              style={{ width: PHOTO, height: PHOTO }}
              onError={() => setPhotoFailed(true)}
              accessibilityIgnoresInvertColors
              testID="spot-card-photo"
            />
          ) : (
            <ImageIcon size={24} color={theme.textSubtle.val} />
          )}
        </View>
        <View flex={1} gap={space[1]} alignItems="flex-start">
          <Text variant="h3" numberOfLines={2}>
            {spot.name}
          </Text>
          <View
            height={28}
            paddingHorizontal={space[3]}
            borderRadius={radius.full}
            backgroundColor="$primarySoft"
            justifyContent="center"
          >
            <Text variant="caption" tone="primary">
              {modalityLabel(spot.modality)}
            </Text>
          </View>
          {spot.reviewsCount > 0 && spot.ratingAverage != null ? (
            <StarRating value={spot.ratingAverage} count={spot.reviewsCount} />
          ) : (
            <Text variant="caption" tone="muted">
              {ratingText(spot)}
            </Text>
          )}
        </View>
      </View>
      {footer}
    </View>
  );
};
