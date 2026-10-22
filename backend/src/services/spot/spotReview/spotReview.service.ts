import { spotReviewRepository } from '../../../database/repositories/SpotReview';

type SpotReviewServiceProps = {
  rating: number;
  description?: string | null;
  authorId: string;
  spotId: string;
};

export const spotReviewService = async (data: SpotReviewServiceProps) => {
  const result = spotReviewRepository.create(data);

  return result;
};
