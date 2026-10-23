import { ReadySpotDetails } from './ReadySpotDetails';
import {
  SpotDetailsError,
  SpotDetailsLoading,
  SpotNotFound,
} from './SpotDetailsStates';
import { useSpotDetailsPage } from './useSpotDetailsPage';

export const SpotDetailsPage = () => {
  const page = useSpotDetailsPage();

  if (page.status === 'ready' && page.spot) {
    return (
      <ReadySpotDetails
        spot={page.spot}
        onEdit={page.onEdit}
        onDelete={page.onDelete}
        refreshSpot={page.refetch}
      />
    );
  }

  if (page.status === 'notFound') return <SpotNotFound />;
  if (page.status === 'error') return <SpotDetailsError onRetry={page.refetch} />;
  return <SpotDetailsLoading />;
};
