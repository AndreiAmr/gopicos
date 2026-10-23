import { spotDetailsService } from '../../../services/spot/spotDetails/spotDetails.service';

export const spotDetailsController = async (id: string, userId: string) => {
  return spotDetailsService(id, userId);
};
