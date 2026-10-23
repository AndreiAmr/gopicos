import { spotRepository } from '../../../database/repositories/Spot';
import { spotReviewRepository } from '../../../database/repositories/SpotReview';
import { AppError } from '../../../utils/AppError';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export type ListSpotReviewsProps = {
  spotId: string;
  userId: string;
  first?: number | null;
  after?: string | null;
};

export const listSpotReviewsService = async ({
  spotId,
  userId,
  first,
  after,
}: ListSpotReviewsProps) => {
  const size = first ?? DEFAULT_PAGE_SIZE;

  if (!Number.isInteger(size) || size < 1 || size > MAX_PAGE_SIZE) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: `O tamanho da página deve ser de 1 a ${MAX_PAGE_SIZE}.`,
      field: 'first',
    });
  }

  const spot = await spotRepository.find(spotId);

  if (!spot) {
    throw new AppError({
      type: 'NOT_FOUND',
      message: 'Pico não encontrado.',
      statusCode: 404,
    });
  }

  const [page, stats, myReview] = await Promise.all([
    spotReviewRepository.listBySpot({
      spotId,
      excludeAuthorId: userId,
      take: size,
      after: after ?? null,
    }),
    spotReviewRepository.statsBySpot(spotId),
    spotReviewRepository.findByAuthorAndSpotWithAuthor(userId, spotId),
  ]);

  if (page === null) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'Cursor de paginação inválido.',
      field: 'after',
    });
  }

  return {
    items: page.items,
    nextCursor: page.hasMore ? page.items[page.items.length - 1].id : null,
    hasMore: page.hasMore,
    totalCount: stats.count,
    ratingAverage:
      stats.average == null ? null : Math.round(stats.average * 10) / 10,
    myReview,
  };
};
