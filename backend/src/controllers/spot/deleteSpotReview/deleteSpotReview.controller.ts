import { deleteSpotReviewService } from '../../../services/spot/deleteSpotReview/deleteSpotReview.service';

export const deleteSpotReviewController = async (id: string, userId: string) =>
  deleteSpotReviewService({ id, userId });
