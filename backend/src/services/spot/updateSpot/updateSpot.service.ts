import { spotRepository } from '../../../database/repositories/Spot';
import { UpdateSpotInput } from '../../../controllers/spot/updateSpot/updateSpot.controller';
import { IAuthentication } from '../../../models/authentication/authenticationModel';
import {
  FileTooLargeError,
  cloudinaryModel,
  resolveUpload,
} from '../../../models/cloudinary/CloudinaryModel';
import { AppError } from '../../../utils/AppError';
import {
  SPOT_LIMITS,
  imageTooLarge,
  validateImageCount,
  validateImageType,
  validateSpotFields,
} from '../newSpot/validateSpotInput';

type Props = {
  id: string;
  data: UpdateSpotInput;
  auth: IAuthentication;
};

/**
 * Só o autor edita. Valida tudo (campos, polígono, total de 1 a 5 fotos) antes
 * de enviar fotos novas ao Cloudinary e só então grava.
 */
export const updateSpotService = async ({ id, data, auth }: Props) => {
  const spot = await spotRepository.find(id);

  if (!spot) {
    throw new AppError({
      type: 'NOT_FOUND',
      message: 'Pico não encontrado.',
      statusCode: 404,
    });
  }

  if (spot.authorId !== auth.id) {
    throw new AppError({
      type: 'FORBIDDEN',
      message: 'Só quem criou o pico pode editá-lo.',
      statusCode: 403,
    });
  }

  const fields = validateSpotFields(data);

  const kept = [...new Set(data.keepImages ?? spot.images)];
  if (kept.some((url) => !spot.images.includes(url))) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'Uma das fotos mantidas não pertence a este pico.',
      field: 'images',
    });
  }

  const uploads = data.newImages ?? [];
  validateImageCount(kept.length + uploads.length);

  const files = await Promise.all(uploads.map(resolveUpload));
  files.forEach((file) => validateImageType(file?.mimetype));

  const added: string[] = [];

  for (const file of files) {
    try {
      added.push(
        await cloudinaryModel.uploadImage(
          file,
          spot.authorId,
          spot.id,
          SPOT_LIMITS.imageMaxBytes,
        ),
      );
    } catch (error) {
      if (error instanceof FileTooLargeError) throw imageTooLarge();
      throw error;
    }
  }

  return spotRepository.updateSpot(id, fields, [...kept, ...added]);
};
