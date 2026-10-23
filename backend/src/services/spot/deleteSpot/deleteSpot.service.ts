import { spotRepository } from '../../../database/repositories/Spot';
import { IAuthentication } from '../../../models/authentication/authenticationModel';
import { cloudinaryModel } from '../../../models/cloudinary/CloudinaryModel';
import { AppError } from '../../../utils/AppError';

type Props = {
  id: string;
  auth: IAuthentication;
};

/**
 * Só o autor exclui. As avaliações saem em cascata (FK) e as fotos são
 * removidas do Cloudinary depois de excluir o registro; falha na limpeza das
 * fotos não desfaz a exclusão (o pico já não existe para ninguém).
 */
export const deleteSpotService = async ({ id, auth }: Props) => {
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
      message: 'Só quem criou o pico pode excluí-lo.',
      statusCode: 403,
    });
  }

  await spotRepository.deleteById(spot.id);

  try {
    await cloudinaryModel.deleteSpotImages(spot.authorId, spot.id);
  } catch {
    // Fotos órfãs no Cloudinary não devem falhar a exclusão.
  }

  return { id: spot.id };
};
