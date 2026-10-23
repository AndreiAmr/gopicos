import { prisma } from '../../prisma/prisma';

/**
 * Leituras da atividade do próprio usuário (picos e avaliações dele), mais
 * recentes primeiro. Sem paginação no MVP (D31).
 */
export const userActivityRepository = {
  async listSpotsByAuthor(authorId: string) {
    const spots = await prisma.spot.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });

    if (spots.length === 0) return [];

    const stats = await prisma.spotReview.groupBy({
      by: ['spotId'],
      where: { spotId: { in: spots.map((spot) => spot.id) } },
      _avg: { rating: true },
      _count: { _all: true },
    });
    const bySpot = new Map(stats.map((row) => [row.spotId, row]));

    return spots.map((spot) => ({
      ...spot,
      ratingAverage: bySpot.get(spot.id)?._avg.rating ?? null,
      reviewsCount: bySpot.get(spot.id)?._count._all ?? 0,
    }));
  },

  async listReviewsByAuthor(authorId: string) {
    return prisma.spotReview.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: { spot: { select: { id: true, name: true, modality: true } } },
    });
  },
};
