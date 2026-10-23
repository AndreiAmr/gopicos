import { IRepository } from '../..';
import { Modality, Spot } from '../../prisma/generated';
import { prisma } from '../../prisma/prisma';
import { ValidSpotFields } from '../../services/spot/newSpot/validateSpotInput';

type CreateSpotProps = {
  /** Id gerado antes do envio das fotos (pasta no Cloudinary). */
  id?: string;
  data: ValidSpotFields;
  images: string[];
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

export type SpotsFilter = {
  modality?: string | null;
  isPaid?: boolean | null;
  hasCoverage?: boolean | null;
  minRating?: number | null;
};

export type SpotListItem = Spot & {
  ratingAverage: number | null;
  reviewsCount: number;
};

type ISpotRepository = IRepository<string, CreateSpotProps, Spot, Spot> & {
  findDetails(id: string): Promise<SpotDetailsData | null>;
  insertImage(spotId: string, url: string): Promise<Spot>;
  listAll(filter?: SpotsFilter): Promise<SpotListItem[]>;
  deleteById(id: string): Promise<void>;
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

  async updateSpot(
    id: string,
    data: ValidSpotFields,
    images: string[],
  ): Promise<Spot> {
    return prisma.spot.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        modality: data.modality as Modality,
        equipmentRequired: data.equipmentRequired,
        isPaid: data.isPaid,
        alwaysOpen: data.alwaysOpen,
        entryAmount: data.entryAmount,
        hasCoverage: data.hasCoverage,
        coordinates: data.coordinates,
        openingHours: data.openingHours,
        images,
      },
    });
  }

  delete(prop: Spot): Promise<void> {
    throw new Error('Method not implemented.');
  }

  /** Remove o pico; as avaliações saem em cascata (FK onDelete: Cascade). */
  async deleteById(id: string): Promise<void> {
    await prisma.spot.delete({ where: { id } });
  }

  async create({ id, data, images, authorId }: CreateSpotProps): Promise<Spot> {
    return prisma.spot.create({
      data: {
        ...(id ? { id } : {}),
        name: data.name,
        description: data.description,
        modality: data.modality as Modality,
        equipmentRequired: data.equipmentRequired,
        isPaid: data.isPaid,
        alwaysOpen: data.alwaysOpen,
        entryAmount: data.entryAmount,
        hasCoverage: data.hasCoverage,
        coordinates: data.coordinates,
        openingHours: data.openingHours,
        images,
        author: { connect: { id: authorId } },
      },
    });
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

  async listAll(filter: SpotsFilter = {}): Promise<SpotListItem[]> {
    const spots = await prisma.spot.findMany({
      where: {
        ...(filter.modality ? { modality: filter.modality as Modality } : {}),
        ...(filter.isPaid != null ? { isPaid: filter.isPaid } : {}),
        ...(filter.hasCoverage != null
          ? { hasCoverage: filter.hasCoverage }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    const stats = await prisma.spotReview.groupBy({
      by: ['spotId'],
      where: { spotId: { in: spots.map((spot) => spot.id) } },
      _avg: { rating: true },
      _count: { _all: true },
    });
    const statsBySpot = new Map(stats.map((item) => [item.spotId, item]));

    const items = spots.map((spot) => {
      const stat = statsBySpot.get(spot.id);
      const avg = stat?._avg.rating ?? null;

      return {
        ...spot,
        ratingAverage: avg == null ? null : Math.round(avg * 10) / 10,
        reviewsCount: stat?._count._all ?? 0,
      };
    });

    // Pico sem avaliação fica fora quando há filtro de nota mínima.
    if (filter.minRating != null) {
      const min = filter.minRating;

      return items.filter(
        (item) => item.ratingAverage != null && item.ratingAverage >= min,
      );
    }

    return items;
  }
}

export const spotRepository = SpotRepository.getInstance();
