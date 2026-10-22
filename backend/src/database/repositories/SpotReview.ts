import { IRepository } from '../..';

import { SpotReview } from '../../prisma/generated';
import { prisma } from '../../prisma/prisma';

type AddReviewProps = {
  rating: number;
  description?: string | null;
  spotId: string;
  authorId: string;
};

type ISpotReviewRepository = IRepository<string, AddReviewProps, any, any>;

export class SpotReviewRepository implements ISpotReviewRepository {
  private static instance: SpotReviewRepository | undefined;

  private constructor() {}

  public static getInstance(): SpotReviewRepository {
    if (!this.instance) {
      this.instance = new SpotReviewRepository();
    }

    return this.instance;
  }

  async find(id: string): Promise<any | null> {
    throw new Error('Method not implemented.');
  }

  update(prop: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(prop: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(props: AddReviewProps) {
    const result = await prisma.spotReview.create({
      data: {
        rating: props.rating,
        description: props.description ?? null,

        author: {
          connect: {
            id: props.authorId,
          },
        },

        spot: {
          connect: {
            id: props.spotId,
          },
        },
      },
    });

    return result;
  }

  /**
   * Página de avaliações da mais recente para a mais antiga (desempate por id).
   * `after` é o id da última avaliação da página anterior; devolve `null`
   * se o cursor não pertence ao pico.
   */
  async listBySpot({
    spotId,
    excludeAuthorId,
    take,
    after,
  }: ListBySpotProps): Promise<{
    items: ReviewWithAuthor[];
    hasMore: boolean;
  } | null> {
    if (after) {
      const cursor = await prisma.spotReview.findUnique({
        where: { id: after },
      });
      if (!cursor || cursor.spotId !== spotId) return null;
    }

    const rows = await prisma.spotReview.findMany({
      where: { spotId, authorId: { not: excludeAuthorId } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: take + 1,
      ...(after ? { cursor: { id: after }, skip: 1 } : {}),
      include: { author: { select: reviewAuthorSelect } },
    });

    return { items: rows.slice(0, take), hasMore: rows.length > take };
  }

  async statsBySpot(spotId: string) {
    const stats = await prisma.spotReview.aggregate({
      where: { spotId },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return { average: stats._avg.rating, count: stats._count._all };
  }

  async findByAuthorAndSpotWithAuthor(
    authorId: string,
    spotId: string,
  ): Promise<ReviewWithAuthor | null> {
    return prisma.spotReview.findUnique({
      where: { authorId_spotId: { authorId, spotId } },
      include: { author: { select: reviewAuthorSelect } },
    });
  }
}

const reviewAuthorSelect = {
  id: true,
  firstName: true,
  lastName: true,
  deactivatedAt: true,
} as const;

type ListBySpotProps = {
  spotId: string;
  excludeAuthorId: string;
  take: number;
  after: string | null;
};

export type ReviewWithAuthor = SpotReview & {
  author: {
    id: string;
    firstName: string;
    lastName: string;
    deactivatedAt: Date | null;
  };
};

export const spotReviewRepository = SpotReviewRepository.getInstance();
