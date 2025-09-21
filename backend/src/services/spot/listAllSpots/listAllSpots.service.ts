import { Spot } from '../../../../prisma/generated';
import { spotRepository } from '../../../database/repositories/Spot';

export const listAllSpotsService = async (): Promise<Spot[]> => {
  return spotRepository.listAll();
};
