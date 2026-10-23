import { MapPin } from 'lucide-react-native';
import { EmptyState } from '../../../../atomic/ds/molecules/EmptyState';
import { SpotCard, SpotCardSkeleton } from '../../../../atomic/ds/molecules/SpotCard';
import { ActivityScreen } from './ActivityScreen';
import { activityStrings, spotsCountLabel } from './logic';
import { useMySpotsScreen } from './useActivityScreens';

export const MySpotsTemplate = () => {
  const s = useMySpotsScreen();

  return (
    <ActivityScreen
      title={activityStrings.mySpots}
      caption={s.spots && s.spots.length > 0 ? spotsCountLabel(s.spots.length) : undefined}
      refreshing={s.refreshing}
      onRefresh={s.refresh}
      onBack={s.goBack}
    >
      {s.loading ? (
        <>
          <SpotCardSkeleton testID="my-spots-skeleton" />
          <SpotCardSkeleton />
          <SpotCardSkeleton />
        </>
      ) : null}

      {s.error ? (
        <EmptyState
          kind="error"
          title={activityStrings.loadError}
          actionLabel={activityStrings.retry}
          onActionPress={s.refresh}
          testID="my-spots-error"
        />
      ) : null}

      {s.spots && s.spots.length === 0 ? (
        <EmptyState
          icon={<MapPin size={32} />}
          title={activityStrings.spotsEmptyTitle}
          description={activityStrings.spotsEmptyText}
          actionLabel={activityStrings.spotsEmptyAction}
          onActionPress={s.goToNewSpot}
          testID="my-spots-empty"
        />
      ) : null}

      {s.spots?.map(spot => (
        <SpotCard
          key={spot.id}
          spot={spot}
          onPress={() => s.openSpot(spot.id)}
          testID={`my-spot-${spot.id}`}
        />
      ))}
    </ActivityScreen>
  );
};
