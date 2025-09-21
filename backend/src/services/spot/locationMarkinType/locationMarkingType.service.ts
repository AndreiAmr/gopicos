import { LocationMarkingType } from '../../../../prisma/generated';
import { locationMarkingTypeRepository } from '../../../database/repositories/LocationMarkingType';

export const getAllLocationMarkingTypesServices = async (): Promise<
  LocationMarkingType[]
> => {
  const options = await locationMarkingTypeRepository.findAll();
  return options || [];
};
