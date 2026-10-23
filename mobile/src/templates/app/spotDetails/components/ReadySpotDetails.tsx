import { View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { space } from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import type { SpotDetails } from '../../../../domain/spot/details';
import { reviewStrings } from '../../../../domain/spot/reviews';
import { useReviewsFlow } from '../useReviewsFlow';
import { ReviewFormSheet } from './ReviewFormSheet';
import { ReviewsSection } from './ReviewsSection';
import { SpotDetailsContent } from './SpotDetailsContent';

type ReadySpotDetailsProps = {
  spot: SpotDetails;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  refreshSpot: () => void;
};

/** Detalhe pronto: conteúdo + avaliações + barra fixa "Avaliar este pico". */
export const ReadySpotDetails = ({
  spot,
  onBack,
  onEdit,
  onDelete,
  refreshSpot,
}: ReadySpotDetailsProps) => {
  const flow = useReviewsFlow({ spotId: spot.id, refreshSpot });
  const { reviews } = flow;
  const hasMine = Boolean(reviews.myReview);

  const bottomBar = spot.isOwner ? null : (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
      <View
        paddingHorizontal={space[4]}
        paddingVertical={space[3]}
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$divider"
      >
        <Button
          label={hasMine ? reviewStrings.seeMine : reviewStrings.rate}
          onPress={hasMine ? flow.scrollToReviews : flow.openForm}
          fullWidth
          testID="review-cta"
        />
      </View>
    </SafeAreaView>
  );

  return (
    <>
      <SpotDetailsContent
        spot={spot}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
        scrollRef={flow.scrollRef}
        onScroll={flow.onScroll}
        bottomBar={bottomBar}
        reviewsSection={
          <View
            onLayout={event => {
              flow.sectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <ReviewsSection
              status={reviews.status}
              items={reviews.items}
              myReview={reviews.myReview}
              totalCount={reviews.totalCount}
              ratingAverage={reviews.ratingAverage}
              isOwner={spot.isOwner}
              loadingMore={reviews.loadingMore}
              moreError={reviews.moreError}
              onRetry={() => reviews.reload()}
              onRetryMore={reviews.loadMore}
            />
          </View>
        }
      />
      {spot.isOwner ? null : (
        <ReviewFormSheet
          ref={flow.sheetRef}
          submitting={flow.submitting}
          error={flow.error}
          commentError={flow.commentError}
          onSubmit={flow.submit}
          onClose={flow.clearErrors}
        />
      )}
    </>
  );
};
