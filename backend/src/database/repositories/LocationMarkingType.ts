import { IRepository } from '../..';
import { LocationMarkingType } from '../../../prisma/generated';
import { prisma } from '../../../prisma/prisma';

type WithIdProp = {
  id: number;
};

type IUpdateLocationMarkingType = Partial<LocationMarkingType>;

type ILocationMarkingTypeRepository = IRepository<
  WithIdProp,
  LocationMarkingType,
  IUpdateLocationMarkingType,
  WithIdProp
> & {
  findAll(): Promise<LocationMarkingType[]>;
};

export class LocationMarkingTypeRepository
  implements ILocationMarkingTypeRepository
{
  private static instance: LocationMarkingTypeRepository | undefined;

  private constructor() {}

  public static getInstance(): LocationMarkingTypeRepository {
    if (!this.instance) {
      this.instance = new LocationMarkingTypeRepository();
    }

    return this.instance;
  }

  async find(prop: WithIdProp): Promise<LocationMarkingType | null> {
    const LocationMarkingType = await prisma.locationMarkingType.findUnique({
      where: {
        id: prop.id,
      },
    });

    return LocationMarkingType;
  }

  findAll(): Promise<LocationMarkingType[]> {
    return prisma.locationMarkingType.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  update(prop: IUpdateLocationMarkingType): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(prop: WithIdProp): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(prop: LocationMarkingType): Promise<LocationMarkingType> {
    throw new Error('Method not implemented.');
  }
}

export const locationMarkingTypeRepository =
  LocationMarkingTypeRepository.getInstance();
