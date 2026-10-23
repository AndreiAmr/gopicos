import { Prisma } from '../../../prisma/generated';
import { spotRepository } from '../../../database/repositories/Spot';
import { spotReviewRepository } from '../../../database/repositories/SpotReview';
import { AppError } from '../../../utils/AppError';

type SpotReviewServiceProps = {
  rating: number;
  description?: string | null;
  authorId: string;
  spotId: string;
};

const MAX_DESCRIPTION = 500;

const reviewAlreadyExists = () =>
  new AppError({
    type: 'REVIEW_ALREADY_EXISTS',
    message: 'Você já avaliou este pico. Edite a sua avaliação.',
    statusCode: 409,
  });

export const spotReviewService = async (data: SpotReviewServiceProps) => {
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'A nota deve ser um número inteiro de 1 a 5.',
      field: 'rating',
    });
  }

  const description = data.description?.trim() || null;

  if (description && description.length > MAX_DESCRIPTION) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'O comentário deve ter no máximo 500 caracteres.',
      field: 'description',
    });
  }

  const spot = await spotRepository.find(data.spotId);

  if (!spot) {
    throw new AppError({
      type: 'NOT_FOUND',
      message: 'Pico não encontrado.',
      statusCode: 404,
    });
  }

  if (spot.authorId === data.authorId) {
    throw new AppError({
      type: 'OWN_SPOT_REVIEW',
      message: 'Você não pode avaliar o seu próprio pico.',
      statusCode: 403,
    });
  }

  const existing = await spotReviewRepository.findByAuthorAndSpot(
    data.authorId,
    data.spotId,
  );

  if (existing) {
    throw reviewAlreadyExists();
  }

  try {
    return await spotReviewRepository.create({ ...data, description });
  } catch (err) {
    // Envio simultâneo (ex.: duplo toque): o unique (authorId, spotId) decide.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw reviewAlreadyExists();
    }

    throw err;
  }
};
