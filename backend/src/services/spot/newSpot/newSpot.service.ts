import { randomUUID } from 'crypto';
import { NewSpotInput } from '../../../controllers/spot/newSpot/newSpot.controller';
import { spotRepository } from '../../../database/repositories/Spot';
import { IAuthentication } from '../../../models/authentication/authenticationModel';
import {
  FileTooLargeError,
  cloudinaryModel,
  resolveUpload,
} from '../../../models/cloudinary/CloudinaryModel';
import {
  SPOT_LIMITS,
  imageTooLarge,
  validateImageCount,
  validateImageType,
  validateSpotFields,
} from './validateSpotInput';

type INewSpotServiceProps = {
  data: NewSpotInput;
  auth: IAuthentication;
};

/**
 * Valida tudo antes de gravar (campos, polígono, 1 a 5 fotos de imagem),
 * envia as fotos ao Cloudinary e só então cria o pico, já com as URLs.
 * Assim uma foto inválida não deixa pico pela metade no banco.
 */
export const createSpotService = async ({
  data,
  auth,
}: INewSpotServiceProps) => {
  const fields = validateSpotFields(data);

  const uploads = data.images ?? [];
  validateImageCount(uploads.length);

  const files = await Promise.all(uploads.map(resolveUpload));
  files.forEach((file) => validateImageType(file?.mimetype));

  const spotId = randomUUID();
  const images: string[] = [];

  for (const file of files) {
    try {
      images.push(
        await cloudinaryModel.uploadImage(
          file,
          auth.id,
          spotId,
          SPOT_LIMITS.imageMaxBytes,
        ),
      );
    } catch (error) {
      if (error instanceof FileTooLargeError) throw imageTooLarge();
      throw error;
    }
  }

  return spotRepository.create({
    id: spotId,
    data: fields,
    images,
    authorId: auth.id,
  });
};

export const newSpotServices = {
  createSpotService,
};
