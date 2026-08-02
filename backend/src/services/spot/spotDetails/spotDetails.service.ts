import { Spot } from '@prisma/client';
import { spotRepository } from '../../../database/repositories/Spot';

export const spotDetailsService = async (id: string): Promise<Spot | null> => {
  return await spotRepository.find(id);
};
