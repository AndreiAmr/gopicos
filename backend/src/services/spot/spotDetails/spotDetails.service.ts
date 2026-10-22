import {
  spotRepository,
  SpotDetailsData,
} from '../../../database/repositories/Spot';
import { AppError } from '../../../utils/AppError';

export const spotDetailsService = async (
  id: string,
  userId: string,
): Promise<SpotDetailsData & { isOwner: boolean }> => {
  const spot = await spotRepository.findDetails(id);

  if (!spot) {
    throw new AppError({
      type: 'NOT_FOUND',
      message: 'Pico não encontrado.',
      statusCode: 404,
    });
  }

  return { ...spot, isOwner: spot.authorId === userId };
};
