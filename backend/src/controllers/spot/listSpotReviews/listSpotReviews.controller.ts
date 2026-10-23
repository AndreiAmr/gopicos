import { ReviewWithAuthor } from '../../../database/repositories/SpotReview';
import {
  ListSpotReviewsProps,
  listSpotReviewsService,
} from '../../../services/spot/listSpotReviews/listSpotReviews.service';

const toReview = (review: ReviewWithAuthor, userId: string) => ({
  id: review.id,
  rating: review.rating,
  description: review.description,
  createdAt: review.createdAt.toISOString(),
  author: review.author,
  isMine: review.authorId === userId,
});

export const listSpotReviewsController = async (
  props: ListSpotReviewsProps,
) => {
  const page = await listSpotReviewsService(props);

  return {
    ...page,
    items: page.items.map((review) => toReview(review, props.userId)),
    myReview: page.myReview ? toReview(page.myReview, props.userId) : null,
  };
};
