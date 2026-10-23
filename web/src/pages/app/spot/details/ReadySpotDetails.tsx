import { Button } from '@/atomic/atoms/button';
import type { SpotDetails } from '@/domain/spot/details';
import { reviewStrings } from '@/domain/spot/reviews';
import { ReviewDialog } from './ReviewDialog';
import { ReviewsSection } from './ReviewsSection';
import { SpotDetailsContent } from './SpotDetailsContent';
import { useReviewsFlow } from './useReviewsFlow';

type ReadySpotDetailsProps = {
  spot: SpotDetails;
  onEdit: () => void;
  onDelete: () => void;
  refreshSpot: () => void;
};

const scrollToReviews = () => {
  const target = document.getElementById('avaliacoes');
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target?.focus({ preventScroll: true });
};

/** Detalhe pronto: conteúdo + botão "Avaliar este pico" + seção e dialog de avaliações. */
export const ReadySpotDetails = ({
  spot,
  onEdit,
  onDelete,
  refreshSpot,
}: ReadySpotDetailsProps) => {
  const flow = useReviewsFlow({ spotId: spot.id, refreshSpot });
  const { reviews } = flow;
  const hasMine = Boolean(reviews.myReview);

  const reviewAction = spot.isOwner ? null : (
    <Button
      size="lg"
      className="w-full"
      onClick={hasMine ? scrollToReviews : flow.openForm}
    >
      {hasMine ? reviewStrings.seeMine : reviewStrings.rate}
    </Button>
  );

  return (
    <>
      <SpotDetailsContent
        spot={spot}
        onEdit={onEdit}
        onDelete={onDelete}
        reviewAction={reviewAction}
        reviewsSection={
          <ReviewsSection
            status={reviews.status}
            items={reviews.items}
            myReview={reviews.myReview}
            totalCount={reviews.totalCount}
            ratingAverage={reviews.ratingAverage}
            isOwner={spot.isOwner}
            hasMore={reviews.hasMore}
            loadingMore={reviews.loadingMore}
            moreError={reviews.moreError}
            lastLoaded={reviews.lastLoaded}
            onRetry={() => void reviews.reload()}
            onLoadMore={() => void reviews.loadMore()}
          />
        }
      />
      {spot.isOwner ? null : (
        <ReviewDialog
          open={flow.open}
          submitting={flow.submitting}
          error={flow.error}
          commentError={flow.commentError}
          onSubmit={flow.submit}
          onClose={flow.closeForm}
        />
      )}
    </>
  );
};
