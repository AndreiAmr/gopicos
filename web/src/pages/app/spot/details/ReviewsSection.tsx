import { useEffect, useRef, useState } from 'react';
import { StarIcon } from 'lucide-react';

import { Button } from '@/atomic/atoms/button';
import { Skeleton } from '@/atomic/atoms/skeleton';
import { Text } from '@/atomic/atoms/text';
import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { StarRating } from '@/atomic/molecules/starRating';
import { reviewsCountText } from '@/domain/spot/details';
import {
  authorInitial,
  authorName,
  fullDate,
  loadedAnnouncement,
  relativeDate,
  reviewA11yLabel,
  reviewStrings,
  type Review,
} from '@/domain/spot/reviews';

const COMMENT_CHARS_COLLAPSED = 220;

type ReviewItemProps = {
  review: Review;
  mine?: boolean;
  /** Foco programático (primeiro item novo após "Carregar mais"). */
  focusRef?: React.Ref<HTMLLIElement>;
};

export const ReviewItem = ({ review, mine = false, focusRef }: ReviewItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const relative = relativeDate(review.createdAt);
  const long = (review.description?.length ?? 0) > COMMENT_CHARS_COLLAPSED;

  return (
    <li
      ref={focusRef}
      tabIndex={-1}
      data-testid={mine ? 'my-review' : 'review-item'}
      aria-label={reviewA11yLabel(review, `${relative}, ${fullDate(review.createdAt)}`)}
      className="flex flex-col gap-2 border-b border-gp-divider py-4 outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gp-primary-soft text-body-sm font-semibold text-gp-primary-text"
        >
          {authorInitial(review)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <Text variant="body-strong" as="span">
            {authorName(review)}
          </Text>
          <time
            dateTime={review.createdAt}
            title={fullDate(review.createdAt)}
            className="text-caption text-gp-text-muted"
          >
            {relative}
          </time>
        </div>
        {mine ? (
          <span className="rounded-full bg-gp-primary-soft px-2 py-0.5 text-caption font-semibold text-gp-primary-text">
            {reviewStrings.mine}
          </span>
        ) : null}
      </div>
      <StarRating mode="read" value={review.rating} text={`${review.rating} de 5`} />
      {review.description ? (
        <div className="flex flex-col items-start gap-1">
          <Text variant="body" className={expanded ? '' : 'line-clamp-3'}>
            {review.description}
          </Text>
          {long ? (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className="text-body-sm font-semibold text-gp-primary-text underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
            >
              {expanded ? reviewStrings.seeLess : reviewStrings.seeMore}
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
};

type ReviewsSectionProps = {
  status: 'loading' | 'ready' | 'error';
  items: Review[];
  myReview: Review | null;
  totalCount: number;
  ratingAverage: number | null;
  isOwner: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  moreError: boolean;
  lastLoaded: { firstId: string; count: number } | null;
  onRetry: () => void;
  onLoadMore: () => void;
};

/** Seção "Avaliações" (id `avaliacoes`): resumo, minha avaliação fixada e lista com "Carregar mais". */
export const ReviewsSection = ({
  status,
  items,
  myReview,
  totalCount,
  ratingAverage,
  isOwner,
  hasMore,
  loadingMore,
  moreError,
  lastLoaded,
  onRetry,
  onLoadMore,
}: ReviewsSectionProps) => {
  const firstNew = useRef<HTMLLIElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const hasAny = totalCount > 0;

  // Depois de "Carregar mais": foco no primeiro item novo e anúncio.
  useEffect(() => {
    if (!lastLoaded) return;
    firstNew.current?.focus();
    setAnnouncement(loadedAnnouncement(lastLoaded.count));
  }, [lastLoaded]);

  return (
    <section
      id="avaliacoes"
      tabIndex={-1}
      aria-labelledby="avaliacoes-titulo"
      className="flex flex-col gap-2 outline-none"
      data-testid="reviews-section"
    >
      <Text variant="h2" as="h2" id="avaliacoes-titulo">
        {reviewStrings.section}
      </Text>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {status === 'loading' ? (
        <div className="flex flex-col gap-4" data-testid="reviews-loading">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : null}

      {status === 'error' ? (
        <AlertBanner
          variant="error"
          action={{ label: reviewStrings.retry, onClick: onRetry }}
        >
          {reviewStrings.loadError}
        </AlertBanner>
      ) : null}

      {status === 'ready' && hasAny ? (
        <div className="flex items-center gap-3">
          <span className="text-h1 font-bold text-gp-text">
            {(ratingAverage ?? 0).toFixed(1).replace('.', ',')}
          </span>
          <div className="flex flex-col">
            <StarRating mode="read" value={ratingAverage ?? 0} text="" />
            <Text variant="caption" tone="muted">
              {reviewsCountText(totalCount)}
            </Text>
          </div>
        </div>
      ) : null}

      {status === 'ready' && !hasAny ? (
        <div
          data-testid="reviews-empty"
          className="flex flex-col items-center gap-2 py-8 text-center"
        >
          {isOwner ? (
            <Text variant="body" tone="muted">
              {reviewStrings.ownSpotNoReviews}
            </Text>
          ) : (
            <>
              <StarIcon className="size-8 text-gp-text-subtle" aria-hidden="true" />
              <Text variant="h3" as="p">
                {reviewStrings.emptyTitle}
              </Text>
              <Text variant="body" tone="muted">
                {reviewStrings.emptyText}
              </Text>
            </>
          )}
        </div>
      ) : null}

      {status === 'ready' && isOwner && hasAny ? (
        <Text variant="caption" tone="muted">
          {reviewStrings.ownSpot}
        </Text>
      ) : null}

      {status === 'ready' && (myReview || items.length > 0) ? (
        <ul>
          {myReview ? <ReviewItem review={myReview} mine /> : null}
          {items.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              focusRef={review.id === lastLoaded?.firstId ? firstNew : undefined}
            />
          ))}
        </ul>
      ) : null}

      {status === 'ready' && moreError ? (
        <AlertBanner
          variant="error"
          action={{ label: reviewStrings.retry, onClick: onLoadMore }}
        >
          {reviewStrings.loadMoreError}
        </AlertBanner>
      ) : null}

      {status === 'ready' && hasMore ? (
        <Button
          variant="secondary"
          className="self-center"
          onClick={onLoadMore}
          disabled={loadingMore}
          aria-busy={loadingMore || undefined}
        >
          {loadingMore ? reviewStrings.loadingMore : reviewStrings.loadMore}
        </Button>
      ) : null}
    </section>
  );
};
