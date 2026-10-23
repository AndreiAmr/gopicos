import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPinOff } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { space } from '../../../config/tamagui/tokens';
import { AlertBanner, EmptyState, Skeleton } from '../../../atomic/ds';
import { BackButton } from './components/SpotDetailsContent';
import { ReadySpotDetails } from './components/ReadySpotDetails';
import { GALLERY_HEIGHT } from './components/Gallery';
import { spotDetailsStrings, useSpotDetails } from './useSpotDetails';

const LoadingState = () => (
  <View flex={1} backgroundColor="$bg" testID="spot-details-loading">
    <Skeleton width="100%" height={GALLERY_HEIGHT} shape="block" />
    <View padding={space[4]} gap={space[4]}>
      <Skeleton width="70%" height={28} />
      <Skeleton width="100%" height={72} shape="block" />
      <Skeleton width="100%" height={72} shape="block" />
      <Skeleton width="100%" height={72} shape="block" />
    </View>
  </View>
);

export const SpotDetailsTemplate = () => {
  const theme = useTheme();
  const details = useSpotDetails();

  if (details.status === 'ready' && details.spot) {
    return (
      <ReadySpotDetails
        spot={details.spot}
        onBack={details.goBack}
        onEdit={details.onEdit}
        refreshSpot={details.retry}
      />
    );
  }

  if (details.status === 'loading' || details.status === 'unauthenticated') {
    return <LoadingState />;
  }

  return (
    <View flex={1} backgroundColor="$bg">
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View padding={space[4]}>
          <BackButton onPress={details.goBack} />
        </View>
        {details.status === 'notFound' ? (
          <View flex={1} justifyContent="center" testID="spot-details-not-found">
            <EmptyState
              title={spotDetailsStrings.notFoundTitle}
              description={spotDetailsStrings.notFoundDescription}
              icon={<MapPinOff size={32} color={theme.primaryText.val} />}
              actionLabel={spotDetailsStrings.backToMap}
              onActionPress={details.goBack}
            />
          </View>
        ) : (
          <View padding={space[4]} testID="spot-details-error">
            <AlertBanner
              type="error"
              message={spotDetailsStrings.error}
              actionLabel="Tentar novamente"
              onActionPress={details.retry}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};
