import { Prisma } from '../../../prisma/generated';
import { spotRepository } from '../../../database/repositories/Spot';
import { spotReviewRepository } from '../../../database/repositories/SpotReview';
import { AppError } from '../../../utils/AppError';
import { validateReviewInput } from './validateReviewInput';

type SpotReviewServiceProps = {
  rating: number;
  description?: string | null;
  authorId: string;
  spotId: string;
};

const reviewAlreadyExists = () =>
  new AppError({
    type: 'REVIEW_ALREADY_EXISTS',
    message: 'Você já avaliou este pico. Edite a sua avaliação.',
    statusCode: 409,
  });

export const spotReviewService = async (data: SpotReviewServiceProps) => {
  const { description } = validateReviewInput(data);

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
