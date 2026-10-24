import { spotReviewRepository } from '../../../database/repositories/SpotReview';
import { AppError } from '../../../utils/AppError';
import { validateReviewInput } from '../spotReview/validateReviewInput';

export type UpdateSpotReviewProps = {
  id: string;
  userId: string;
  rating: number;
  description?: string | null;
};

export const reviewNotFound = () =>
  new AppError({
    type: 'NOT_FOUND',
    message: 'Avaliação não encontrada.',
    statusCode: 404,
  });

/**
 * Só o autor edita. Nota e comentário são substituídos (comentário vazio ou
 * ausente apaga o anterior). A média do pico é calculada na leitura, então
 * já sai atualizada.
 */
export const updateSpotReviewService = async ({
  id,
  userId,
  ...input
}: UpdateSpotReviewProps) => {
  const data = validateReviewInput(input);
  const review = await spotReviewRepository.find(id);

  if (!review) {
    throw reviewNotFound();
  }

  if (review.authorId !== userId) {
    throw new AppError({
      type: 'FORBIDDEN',
      message: 'Só quem escreveu a avaliação pode alterá-la.',
      statusCode: 403,
    });
  }

  return spotReviewRepository.updateById(id, data);
};
