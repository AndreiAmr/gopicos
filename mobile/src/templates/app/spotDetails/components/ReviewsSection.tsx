import { useState } from 'react';
import { Star } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { radius, space } from '../../../../config/tamagui/tokens';
import { Skeleton } from '../../../../atomic/ds/atoms/Skeleton';
import { StarRating } from '../../../../atomic/ds/atoms/StarRating';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { AlertBanner } from '../../../../atomic/ds/auth/AlertBanner';
import { TextLink } from '../../../../atomic/ds/auth/TextLink';
import { reviewsCountText } from '../../../../domain/spot/details';
import {
  Review,
  authorInitial,
  authorName,
  reviewA11yLabel,
  reviewStrings,
} from '../../../../domain/spot/reviews';
import { relativeDate } from '../../profile/activity/logic';

const COMMENT_LINES = 3;

/**
 * Item de avaliação: avatar de iniciais, nome, data relativa, nota e
 * comentário. A minha traz selo e as ações "Editar" e "Excluir".
 */
export const ReviewItem = ({
  review,
  mine = false,
  onEdit,
  onDelete,
}: {
  review: Review;
  mine?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const relative = relativeDate(review.createdAt);
  const hasActions = mine && Boolean(onEdit || onDelete);

  return (
    <View
      paddingVertical={space[3]}
      gap={space[2]}
      borderBottomWidth={1}
      borderBottomColor="$divider"
      // Com ações, cada botão precisa de foco próprio no leitor de tela.
      accessible={!truncated && !hasActions}
      accessibilityLabel={reviewA11yLabel(review, relative)}
      testID={mine ? 'my-review' : 'review-item'}
    >
      <View flexDirection="row" alignItems="center" gap={space[3]}>
        <View
          width={32}
          height={32}
          borderRadius={radius.full}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$primarySoft"
          accessible={false}
        >
          <Text variant="label" tone="primary">
            {authorInitial(review)}
          </Text>
        </View>
        <View flex={1}>
          <Text variant="bodyStrong">{authorName(review)}</Text>
          <Text variant="caption" tone="muted">
            {relative}
          </Text>
        </View>
        {mine ? (
          <View
            paddingHorizontal={space[2]}
            minHeight={24}
            justifyContent="center"
            borderRadius={radius.full}
            backgroundColor="$primarySoft"
          >
            <Text variant="caption" tone="primary">
              {reviewStrings.mine}
            </Text>
          </View>
        ) : null}
      </View>
      <StarRating value={review.rating} />
      {review.description ? (
        <View gap={space[1]}>
          <Text
            variant="body"
            numberOfLines={expanded ? undefined : COMMENT_LINES}
            onTextLayout={event => {
              if (!expanded) {
                setTruncated(event.nativeEvent.lines.length > COMMENT_LINES);
              }
            }}
          >
            {review.description}
          </Text>
          {truncated || expanded ? (
            <TextLink
              label={expanded ? reviewStrings.seeLess : reviewStrings.seeMore}
              onPress={() => setExpanded(value => !value)}
            />
          ) : null}
        </View>
      ) : null}
      {hasActions ? (
        <View flexDirection="row" gap={space[3]} testID="my-review-actions">
          {onEdit ? (
            <View flex={1}>
              <Button
                label={reviewStrings.edit}
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => onEdit(review)}
                accessibilityLabel={reviewStrings.editA11y}
                testID="my-review-edit"
              />
            </View>
          ) : null}
          {onDelete ? (
            <View flex={1}>
              <Button
                label={reviewStrings.remove}
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => onDelete(review)}
                accessibilityLabel={reviewStrings.removeA11y}
                testID="my-review-delete"
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const ReviewSkeleton = () => (
  <View paddingVertical={space[3]} gap={space[2]}>
    <View flexDirection="row" gap={space[3]} alignItems="center">
      <Skeleton width={32} height={32} />
      <Skeleton width="40%" height={16} />
    </View>
    <Skeleton width="100%" height={14} />
    <Skeleton width="70%" height={14} />
  </View>
);

type ReviewsSectionProps = {
  status: 'loading' | 'ready' | 'error';
  items: Review[];
  myReview: Review | null;
  totalCount: number;
  ratingAverage: number | null;
  isOwner: boolean;
  loadingMore: boolean;
  moreError: boolean;
  onRetry: () => void;
  onRetryMore: () => void;
  onEditMine?: (review: Review) => void;
  onDeleteMine?: (review: Review) => void;
};

/** Seção "Avaliações": resumo, minha avaliação fixada no topo e a lista paginada. */
export const ReviewsSection = ({
  status,
  items,
  myReview,
  totalCount,
  ratingAverage,
  isOwner,
  loadingMore,
  moreError,
  onRetry,
  onRetryMore,
  onEditMine,
  onDeleteMine,
}: ReviewsSectionProps) => {
  const theme = useTheme();
  const hasAny = totalCount > 0;

  return (
    <View gap={space[2]} testID="reviews-section">
      <Text variant="h2" accessibilityRole="header">
        {reviewStrings.section}
      </Text>

      {status === 'loading' ? (
        <View testID="reviews-loading">
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
        </View>
      ) : null}

      {status === 'error' ? (
        <AlertBanner
          type="error"
          message={reviewStrings.loadError}
          actionLabel={reviewStrings.retry}
          onActionPress={onRetry}
          testID="reviews-error"
        />
      ) : null}

      {status === 'ready' && hasAny ? (
        <View flexDirection="row" alignItems="center" gap={space[3]}>
          <Text variant="h1">
            {(ratingAverage ?? 0).toFixed(1).replace('.', ',')}
          </Text>
          <View>
            <StarRating value={ratingAverage ?? 0} />
            <Text variant="caption" tone="muted">
              {reviewsCountText(totalCount)}
            </Text>
          </View>
        </View>
      ) : null}

      {status === 'ready' && !hasAny ? (
        <View alignItems="center" gap={space[2]} paddingVertical={space[6]} testID="reviews-empty">
          {isOwner ? (
            <Text variant="body" tone="muted">
              {reviewStrings.ownSpotNoReviews}
            </Text>
          ) : (
            <>
              <Star size={32} color={theme.textSubtle.val} />
              <Text variant="h3">{reviewStrings.emptyTitle}</Text>
              <Text variant="body" tone="muted">
                {reviewStrings.emptyText}
              </Text>
            </>
          )}
        </View>
      ) : null}

      {status === 'ready' && isOwner && hasAny ? (
        <Text variant="caption" tone="muted">
          {reviewStrings.ownSpot}
        </Text>
      ) : null}

      {status === 'ready' && myReview ? (
        <ReviewItem
          review={myReview}
          mine
          onEdit={onEditMine}
          onDelete={onDeleteMine}
        />
      ) : null}
      {status === 'ready'
        ? items.map(review => <ReviewItem key={review.id} review={review} />)
        : null}

      {loadingMore ? (
        <Text variant="caption" tone="muted" align="center" accessibilityLiveRegion="polite">
          {reviewStrings.loadingMore}
        </Text>
      ) : null}
      {moreError ? (
        <View alignItems="center" gap={space[1]}>
          <Text variant="bodySm" tone="muted">
            {reviewStrings.loadMoreError}
          </Text>
          <TextLink label={reviewStrings.retry} onPress={onRetryMore} />
        </View>
      ) : null}
    </View>
  );
};
