import { IRepository } from '../..';
import { Spot, User } from '../../../prisma/generated';
import { prisma } from '../../../prisma/prisma';
import { NewSpotInput } from '../../controllers/spot/newSpot/newSpot.controller';

type CreateSpotProps = {
  data: NewSpotInput;
  authorId: string;
};

type ISpotRepository = IRepository<Spot, CreateSpotProps, Spot, Spot> & {
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

  async find(prop: Spot): Promise<Spot | null> {
    throw new Error('Method not implemented.');
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
      modality: data.modality,
      equipmentRequired: data.equipmentRequired,
      isPaid: data.isPaid,
      alwaysOpen: data.alwaysOpen,
      entryAmount: data.entryAmount || '',
      hasCoverage: data.hasCoverage || false,
      coordinates: data.coordinates,
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
