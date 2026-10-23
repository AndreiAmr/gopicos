import { IRepository } from '../..';

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

  async findByAuthorAndSpot(authorId: string, spotId: string) {
    return prisma.spotReview.findUnique({
      where: { authorId_spotId: { authorId, spotId } },
    });
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
}

export const spotReviewRepository = SpotReviewRepository.getInstance();
