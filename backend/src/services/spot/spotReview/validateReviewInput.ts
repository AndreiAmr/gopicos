import { AppError } from '../../../utils/AppError';

export const MAX_REVIEW_DESCRIPTION = 500;

/**
 * Valida nota (inteiro de 1 a 5) e comentário (até 500) de uma avaliação.
 * Devolve o comentário normalizado: sem espaços nas pontas, vazio vira `null`.
 */
export const validateReviewInput = (data: {
  rating: number;
  description?: string | null;
}): { rating: number; description: string | null } => {
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'A nota deve ser um número inteiro de 1 a 5.',
      field: 'rating',
    });
  }

  const description = data.description?.trim() || null;

  if (description && description.length > MAX_REVIEW_DESCRIPTION) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'O comentário deve ter no máximo 500 caracteres.',
      field: 'description',
    });
  }

  return { rating: data.rating, description };
};
