import { View } from 'tamagui';
import { elevation, radius, space } from '../../../../config/tamagui/tokens';
import { SpotSummary } from '../../../../domain/spot/spot';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { SpotCard } from '../SpotCard';

type SpotPreviewProps = {
  spot: SpotSummary;
  /** Texto pronto da distância ("A 1,2 km de você"); omitido sem localização. */
  distanceLabel?: string;
  onViewDetails: () => void;
};

/** Resumo do mapa: SpotCard compacto + distância + "Ver detalhes". */
export const SpotPreview = ({
  spot,
  distanceLabel,
  onViewDetails,
}: SpotPreviewProps) => (
  <View
    backgroundColor="$surface"
    borderRadius={radius.lg}
    {...elevation[2]}
    testID="spot-preview"
  >
    <SpotCard
      spot={spot}
      bare
      footer={
        <View gap={space[2]}>
          {distanceLabel ? (
            <Text variant="caption" tone="muted">
              {distanceLabel}
            </Text>
          ) : null}
          <Button label="Ver detalhes" onPress={onViewDetails} fullWidth />
        </View>
      }
    />
  </View>
);
