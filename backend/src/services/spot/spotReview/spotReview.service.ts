import { spotReviewRepository } from '../../../database/repositories/SpotReview';

type SpotReviewServiceProps = {
  title: string;
  description: string;
  authorId: string;
  spotId: string;
};

export const spotReviewService = async (data: SpotReviewServiceProps) => {
  const result = spotReviewRepository.create(data);

  return result;
};
