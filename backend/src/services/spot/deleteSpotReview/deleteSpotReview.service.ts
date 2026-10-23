import { spotReviewRepository } from '../../../database/repositories/SpotReview';
import { AppError } from '../../../utils/AppError';
import { reviewNotFound } from '../updateSpotReview/updateSpotReview.service';

type DeleteSpotReviewProps = {
  id: string;
  userId: string;
};

/**
 * Só o autor exclui. Depois disso ele pode avaliar o pico de novo e a média
 * (calculada na leitura) já não conta a nota removida.
 */
export const deleteSpotReviewService = async ({
  id,
  userId,
}: DeleteSpotReviewProps) => {
  const review = await spotReviewRepository.find(id);

  if (!review) {
    throw reviewNotFound();
  }

  if (review.authorId !== userId) {
    throw new AppError({
      type: 'FORBIDDEN',
      message: 'Só quem escreveu a avaliação pode excluí-la.',
      statusCode: 403,
    });
  }

  await spotReviewRepository.deleteById(id);

  return { id: review.id, spotId: review.spotId };
};
