import { Link, useNavigate } from 'react-router';

import { EmptyState } from '@/atomic/molecules/emptyState';
import { SpotCard, SpotCardSkeleton } from '@/atomic/molecules/spotCard';
import { StarRating } from '@/atomic/molecules/starRating';
import { Skeleton } from '@/atomic/atoms/skeleton';
import { Text } from '@/atomic/atoms/text';
import { modalityLabel } from '@/domain/spot/spot';
import { useMyReviews, useMySpots } from '@/queries/myActivity/myActivityQueries';
import { URL } from '@/routes/url';
import {
  ACTIVITY_STRINGS,
  fullDate,
  reviewA11yLabel,
  reviewsCountLabel,
  spotsCountLabel,
} from './activityLogic';

const linkClass =
  'block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gp-focus';

const PageHeader = ({ title, count }: { title: string; count?: string }) => (
  <header className="mb-4 flex flex-col gap-1">
    <h1 tabIndex={-1} className="text-h1 text-gp-text">
      {title}
    </h1>
    {count ? (
      <Text variant="caption" tone="muted">
        {count}
      </Text>
    ) : null}
  </header>
);

export const MySpotsPage = () => {
  const { spots, isLoading, isError, retry } = useMySpots();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title={ACTIVITY_STRINGS.mySpots}
        count={isLoading || isError ? undefined : spotsCountLabel(spots.length)}
      />

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-2" data-testid="my-spots-loading">
          {[0, 1, 2].map((key) => (
            <SpotCardSkeleton key={key} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          variant="error"
          title={ACTIVITY_STRINGS.loadError}
          onAction={retry}
        />
      ) : spots.length === 0 ? (
        <EmptyState
          title={ACTIVITY_STRINGS.spotsEmptyTitle}
          description={ACTIVITY_STRINGS.spotsEmptyText}
          actionLabel={ACTIVITY_STRINGS.spotsEmptyAction}
          onAction={() => navigate(URL.NEW_SPOT)}
        />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {spots.map((spot) => (
            <li key={spot.id}>
              <Link to={`/spot/${spot.id}`} className={linkClass}>
                <SpotCard spot={spot} className="hover:bg-gp-sunken" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MyReviewsPage = () => {
  const { reviews, isLoading, isError, retry } = useMyReviews();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title={ACTIVITY_STRINGS.myReviews}
        count={
          isLoading || isError ? undefined : reviewsCountLabel(reviews.length)
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-3" data-testid="my-reviews-loading">
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-lg border border-gp-divider bg-gp-surface p-3"
            >
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          variant="error"
          title={ACTIVITY_STRINGS.loadError}
          onAction={retry}
        />
      ) : reviews.length === 0 ? (
        <EmptyState
          title={ACTIVITY_STRINGS.reviewsEmptyTitle}
          description={ACTIVITY_STRINGS.reviewsEmptyText}
          actionLabel={ACTIVITY_STRINGS.reviewsEmptyAction}
          onAction={() => navigate(URL.HOME)}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <Link
                to={`/spot/${review.spot.id}`}
                aria-label={reviewA11yLabel(review)}
                className={`${linkClass} flex flex-col gap-1 border border-gp-divider bg-gp-surface p-3 hover:bg-gp-sunken`}
              >
                <Text variant="h3" as="span">
                  {review.spot.name}
                </Text>
                <Text variant="caption" tone="muted">
                  {modalityLabel(review.spot.modality)}
                </Text>
                <div className="flex items-center gap-2">
                  <StarRating
                    mode="read"
                    value={review.rating}
                    text={`${review.rating} de 5`}
                  />
                  <time
                    dateTime={review.createdAt}
                    title={fullDate(review.createdAt)}
                    className="text-caption text-gp-text-muted"
                  >
                    {fullDate(review.createdAt)}
                  </time>
                </div>
                {review.description ? (
                  <Text variant="body-sm" className="line-clamp-3">
                    {review.description}
                  </Text>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
