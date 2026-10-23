import { Star } from 'lucide-react-native';
import { View } from 'tamagui';
import { Skeleton } from '../../../../atomic/ds/atoms/Skeleton';
import { StarRating } from '../../../../atomic/ds/atoms/StarRating';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { EmptyState } from '../../../../atomic/ds/molecules/EmptyState';
import { radius, space } from '../../../../config/tamagui/tokens';
import { ActivityScreen } from './ActivityScreen';
import {
  activityStrings,
  relativeDate,
  reviewA11yLabel,
  reviewsCountLabel,
} from './logic';
import { useMyReviewsScreen } from './useActivityScreens';
import type { MyReview } from '../../../../hooks/query/myActivity/myActivityQueries';

const ReviewSkeleton = () => (
  <View
    gap={space[2]}
    padding={space[4]}
    backgroundColor="$surface"
    borderRadius={radius.lg}
    borderWidth={1}
    borderColor="$divider"
    testID="my-reviews-skeleton"
  >
    <Skeleton width="60%" height={20} />
    <Skeleton width={96} height={16} />
    <Skeleton width="90%" height={16} />
    <Skeleton width="70%" height={16} />
  </View>
);

/** Item de "Minhas avaliações": pico, estrelas, data e comentário (até 3 linhas). */
export const ReviewListItem = ({
  review,
  onPress,
}: {
  review: MyReview;
  onPress: () => void;
}) => (
  <View
    gap={space[1]}
    padding={space[4]}
    minHeight={96}
    backgroundColor="$surface"
    borderRadius={radius.lg}
    borderWidth={1}
    borderColor="$divider"
    pressStyle={{ backgroundColor: '$sunken' }}
    onPress={onPress}
    accessible
    accessibilityRole="button"
    accessibilityLabel={reviewA11yLabel(review)}
    testID={`my-review-${review.id}`}
  >
    <Text variant="h3" numberOfLines={2}>
      {review.spot.name}
    </Text>
    <View flexDirection="row" alignItems="center" gap={space[2]}>
      <StarRating value={review.rating} />
      <Text variant="caption" tone="muted">
        {relativeDate(review.createdAt)}
      </Text>
    </View>
    {review.description ? (
      <Text variant="body" numberOfLines={3}>
        {review.description}
      </Text>
    ) : null}
  </View>
);

export const MyReviewsTemplate = () => {
  const s = useMyReviewsScreen();

  return (
    <ActivityScreen
      title={activityStrings.myReviews}
      caption={s.reviews && s.reviews.length > 0 ? reviewsCountLabel(s.reviews.length) : undefined}
      refreshing={s.refreshing}
      onRefresh={s.refresh}
      onBack={s.goBack}
    >
      {s.loading ? (
        <>
          <ReviewSkeleton />
          <ReviewSkeleton />
          <ReviewSkeleton />
        </>
      ) : null}

      {s.error ? (
        <EmptyState
          kind="error"
          title={activityStrings.loadError}
          actionLabel={activityStrings.retry}
          onActionPress={s.refresh}
          testID="my-reviews-error"
        />
      ) : null}

      {s.reviews && s.reviews.length === 0 ? (
        <EmptyState
          icon={<Star size={32} />}
          title={activityStrings.reviewsEmptyTitle}
          description={activityStrings.reviewsEmptyText}
          actionLabel={activityStrings.reviewsEmptyAction}
          onActionPress={s.goToMap}
          testID="my-reviews-empty"
        />
      ) : null}

      {s.reviews?.map(review => (
        <ReviewListItem
          key={review.id}
          review={review}
          onPress={() => s.openSpot(review.spot.id)}
        />
      ))}
    </ActivityScreen>
  );
};
