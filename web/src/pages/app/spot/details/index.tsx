import { SpotDetailsContent } from './SpotDetailsContent';
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
      <SpotDetailsContent
        spot={page.spot}
        onEdit={page.onEdit}
        onDelete={page.onDelete}
      />
    );
  }

  if (page.status === 'notFound') return <SpotNotFound />;
  if (page.status === 'error') return <SpotDetailsError onRetry={page.refetch} />;
  return <SpotDetailsLoading />;
};
