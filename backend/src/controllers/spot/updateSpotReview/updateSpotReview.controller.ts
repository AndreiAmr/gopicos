import {
  UpdateSpotReviewProps,
  updateSpotReviewService,
} from '../../../services/spot/updateSpotReview/updateSpotReview.service';
import { toReview } from '../listSpotReviews/listSpotReviews.controller';

export const updateSpotReviewController = async (
  props: UpdateSpotReviewProps,
) => {
  const review = await updateSpotReviewService(props);

  return toReview(review, props.userId);
};
