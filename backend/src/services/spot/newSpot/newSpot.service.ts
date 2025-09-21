import { NewSpotInput } from '../../../controllers/spot/newSpot/newSpot.controller';
import { spotRepository } from '../../../database/repositories/Spot';
import { IAuthentication } from '../../../models/authentication/authenticationModel';

type INewSpotServiceProps = {
  data: NewSpotInput;
  auth: IAuthentication;
};

export const createSpotService = async ({
  data,
  auth,
}: INewSpotServiceProps) => {
  const spotCreated = await spotRepository.create({
    data,
    authorId: auth.id,
  });

  if (!spotCreated) {
    throw new Error('Erro ao tentar criar spot');
  }

  return spotCreated;
};

export const insertSpotImageService = async (spotId: string, url: string) => {
  const spot = await spotRepository.insertImage(spotId, url);

  return spot;
};

export const newSpotServices = {
  createSpotService,
  insertSpotImageService,
};
