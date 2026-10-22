import { IRepository } from '../..';
import { Modality, Spot } from '../../prisma/generated';
import { prisma } from '../../prisma/prisma';
import { NewSpotInput } from '../../controllers/spot/newSpot/newSpot.controller';

type CreateSpotProps = {
  data: NewSpotInput;
  authorId: string;
};

export type SpotDetailsData = Spot & {
  author: {
    id: string;
    firstName: string;
    lastName: string;
    deactivatedAt: Date | null;
  };
  ratingAverage: number | null;
  reviewsCount: number;
};

type ISpotRepository = IRepository<string, CreateSpotProps, Spot, Spot> & {
  findDetails(id: string): Promise<SpotDetailsData | null>;
  insertImage(spotId: string, url: string): Promise<Spot>;
  listAll(): Promise<Spot[]>;
};

export class SpotRepository implements ISpotRepository {
  private static instance: SpotRepository | undefined;

  private constructor() {}

  public static getInstance(): SpotRepository {
    if (!this.instance) {
      this.instance = new SpotRepository();
    }

    return this.instance;
  }

  async find(id: string): Promise<Spot | null> {
    const spot = await prisma.spot.findUnique({
      where: {
        id,
      },
    });

    return spot;
  }

  async findDetails(id: string): Promise<SpotDetailsData | null> {
    const [spot, stats] = await Promise.all([
      prisma.spot.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              deactivatedAt: true,
            },
          },
        },
      }),
      prisma.spotReview.aggregate({
        where: { spotId: id },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    if (!spot) return null;

    return {
      ...spot,
      ratingAverage: stats._avg.rating,
      reviewsCount: stats._count._all,
    };
  }

  update(prop: Spot): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(prop: Spot): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(props: CreateSpotProps): Promise<Spot> {
    const { data, authorId } = props;

    const spotData = {
      name: data.name,
      description: data.description,
      modality: data.modality as Modality,
      equipmentRequired: data.equipmentRequired || false,
      isPaid: data.isPaid,
      alwaysOpen: data.alwaysOpen,
      entryAmount: data.entryAmount || '',
      hasCoverage: data.hasCoverage || false,
      coordinates: data.coordinates,
      openingHours: data.openingHours,

      // markingType: data.markingType,
    };

    const result = await prisma.spot.create({
      data: {
        ...spotData,

        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    return result;
  }

  async insertImage(spotId: string, url: string): Promise<Spot> {
    const updateSpot = await prisma.spot.update({
      where: {
        id: spotId,
      },
      data: {
        images: {
          push: url,
        },
      },
    });

    return updateSpot;
  }

  async listAll(): Promise<Spot[]> {
    const spots = await prisma.spot.findMany();

    return spots;
  }
}

export const spotRepository = SpotRepository.getInstance();
