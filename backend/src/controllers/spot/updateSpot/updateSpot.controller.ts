import { IAuthentication } from '../../../models/authentication/authenticationModel';
import { updateSpotService } from '../../../services/spot/updateSpot/updateSpot.service';
import { NewSpotInput } from '../newSpot/newSpot.controller';

export type UpdateSpotInput = Omit<NewSpotInput, 'images'> & {
  /** URLs das fotos atuais a manter; omitido = mantém todas. */
  keepImages?: string[] | null;
  /** Uploads do graphql-upload (com `.promise`). */
  newImages?: unknown[] | null;
};

export const updateSpotController = async (
  id: string,
  data: UpdateSpotInput,
  auth: IAuthentication,
) => updateSpotService({ id, data, auth });
