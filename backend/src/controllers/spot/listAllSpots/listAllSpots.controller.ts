import { SpotModel } from '../../../models/spot/spotModel';
import { listAllSpotsService } from '../../../services/spot/listAllSpots/listAllSpots.service';

export const listAllSpotsController = async () => {
  const spots = await listAllSpotsService();

  return spots.map((spot) => new SpotModel(spot));
};
