import cloudinary, { UploadApiResponse } from 'cloudinary';
import { GqlUploadFileProps } from '../..';

import { FileUpload } from '../../controllers/spot/newSpot/newSpot.controller';

cloudinary.v2.config();

class CloudinaryModel {
  async uploadImage(
    file: Promise<FileUpload>,
    authorId: string,
    spotId: string
  ): Promise<string> {
    const { createReadStream, filename } = await file.promise;

    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      folder: `${authorId}/${spotId}`,
    };

    return new Promise<string>(async (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        options,
        (error, result?: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );

      await createReadStream().pipe(uploadStream);
    });
  }
}

export const cloudinaryModel = new CloudinaryModel();
