import { SpotModel } from '../../../models/spot/spotModel';
import { spotDetailsService } from '../../../services/spot/spotDetails/spotDetails.service';

export const spotDetailsController = async (id: string) => {
  const spot = await spotDetailsService(id);

  if (!spot) {
    throw new Error('Spot not founded');
  }

  await new Promise((resolve) => setTimeout(resolve, 10000));

  return new SpotModel(spot);
};
