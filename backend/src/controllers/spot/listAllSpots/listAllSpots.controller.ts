import { SpotsFilter } from '../../../database/repositories/Spot';
import { listAllSpotsService } from '../../../services/spot/listAllSpots/listAllSpots.service';

export const listAllSpotsController = async (filter?: SpotsFilter) => {
  return listAllSpotsService(filter);
};
