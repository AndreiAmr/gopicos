// import FileUpload from 'graphql-upload/index';
import { IAuthentication } from '../../../models/authentication/authenticationModel';
import {
  // newSpotService,
  newSpotServices,
} from '../../../services/spot/newSpot/newSpot.service';
import { cloudinaryModel } from '../../../models/cloudinary/CloudinaryModel';

export type FileUpload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
};

export type NewSpotInput = {
  name: string;
  description: string;
  images: Promise<FileUpload>[];
  modality: string;
  isPaid: boolean;
  alwaysOpen: boolean;
  hasCoverage: boolean;
  equipmentRequired: boolean;
  entryAmount?: string;
  coordinates: number[];
};

export const newSpotController = async (
  data: NewSpotInput,
  auth: IAuthentication
) => {
  try {
    const result = await newSpotServices.createSpotService({ data, auth });

    for (const image of data.images) {
      const imageUrl = await cloudinaryModel.uploadImage(
        image,
        auth.id,
        result.id
      );

      await newSpotServices.insertSpotImageService(result.id, imageUrl);
    }

    return {
      name: result.name || 'nao enviado',
    };
  } catch (err) {
    console.log('🚀 ~ newSpotController ~ err:', err);
  }
};
