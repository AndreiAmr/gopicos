import { IAuthentication } from '../../../models/authentication/authenticationModel';
import { deleteSpotService } from '../../../services/spot/deleteSpot/deleteSpot.service';

export const deleteSpotController = async (
  id: string,
  auth: IAuthentication,
) => {
  return deleteSpotService({ id, auth });
};
