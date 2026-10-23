import { ArrowLeft } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, useTheme } from 'tamagui';
import { elevation, radius, space } from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { StarRating } from '../../../../atomic/ds/atoms/StarRating';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { InfoRow } from '../../../../atomic/ds/molecules/InfoRow';
import {
  SpotDetails,
  createdByText,
  detailChips,
  infoRows,
  reviewsCountText,
} from '../../../../domain/spot/details';
import { modalityLabel } from '../../../../domain/spot/spot';
import { spotDetailsStrings } from '../strings';
import { Gallery } from './Gallery';
import { MiniMap } from './MiniMap';

type Chip = { label: string; highlight?: boolean };

const ChipRow = ({ chips }: { chips: Chip[] }) => (
  <View flexDirection="row" flexWrap="wrap" gap={space[2]}>
    {chips.map(chip => (
      <View
        key={chip.label}
        minHeight={28}
        paddingHorizontal={space[3]}
        borderRadius={radius.full}
        justifyContent="center"
        backgroundColor={chip.highlight ? '$primarySoft' : '$surface'}
        borderWidth={chip.highlight ? 0 : 1}
        borderColor="$border"
      >
        <Text variant="caption" tone={chip.highlight ? 'primary' : 'default'}>
          {chip.label}
        </Text>
      </View>
    ))}
  </View>
);

/** Botão circular de voltar sobre a galeria. */
export const BackButton = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme();
  return (
    <View
      width={44}
      height={44}
      borderRadius={radius.full}
      backgroundColor="$surface"
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      pressStyle={{ backgroundColor: '$sunken' }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={spotDetailsStrings.back}
      testID="spot-details-back"
      {...elevation[1]}
    >
      <ArrowLeft size={22} color={theme.text.val} />
    </View>
  );
};

type ContentProps = {
  spot: SpotDetails;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const SpotDetailsContent = ({
  spot,
  onBack,
  onEdit,
  onDelete,
}: ContentProps) => {
  const rows = infoRows(spot);
  const hasRating = spot.reviewsCount > 0 && spot.ratingAverage != null;

  return (
    <View flex={1} backgroundColor="$bg">
      <ScrollView contentContainerStyle={{ paddingBottom: space[8] }}>
        <Gallery images={spot.images ?? []} spotName={spot.name} />

        <View padding={space[4]} gap={space[4]}>
          <Text variant="h1" accessibilityRole="header">
            {spot.name}
          </Text>

          <ChipRow
            chips={[
              { label: modalityLabel(spot.modality), highlight: true },
              ...detailChips(spot).map(label => ({ label })),
            ]}
          />

          <View flexDirection="row" alignItems="center" gap={space[2]}>
            {hasRating ? (
              <>
                <StarRating value={spot.ratingAverage as number} />
                <Text variant="label">
                  {(spot.ratingAverage as number).toFixed(1).replace('.', ',')}
                </Text>
              </>
            ) : null}
            <Text variant="bodySm" tone="muted" testID="spot-details-reviews-count">
              {reviewsCountText(spot.reviewsCount)}
            </Text>
          </View>

          {spot.description ? <Text variant="body">{spot.description}</Text> : null}

          <View>
            {rows.map((row, i) => (
              <InfoRow
                key={row.label}
                label={row.label}
                value={row.value}
                last={i === rows.length - 1}
              />
            ))}
          </View>

          <MiniMap spot={spot} />

          <Text variant="caption" tone="muted" testID="spot-details-author">
            {createdByText(spot)}
          </Text>

          {spot.isOwner ? (
            <View flexDirection="row" gap={space[3]} testID="spot-owner-actions">
              <View flex={1}>
                <Button
                  label={spotDetailsStrings.edit}
                  variant="ghost"
                  fullWidth
                  onPress={onEdit}
                  testID="spot-edit"
                />
              </View>
              <View flex={1}>
                <Button
                  label={spotDetailsStrings.remove}
                  variant="ghost"
                  fullWidth
                  onPress={onDelete}
                  testID="spot-delete"
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <SafeAreaView
        edges={['top']}
        style={{ position: 'absolute', top: 0, left: 0 }}
        pointerEvents="box-none"
      >
        <View padding={space[4]}>
          <BackButton onPress={onBack} />
        </View>
      </SafeAreaView>
    </View>
  );
};
