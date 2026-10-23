import cloudinary, { UploadApiResponse } from 'cloudinary';
import { Transform } from 'stream';

import { FileUpload } from '../../controllers/spot/newSpot/newSpot.controller';

cloudinary.v2.config();

/** Erro lançado quando o arquivo passa do limite de bytes durante o envio. */
export class FileTooLargeError extends Error {
  constructor() {
    super('Arquivo acima do limite');
    this.name = 'FileTooLargeError';
  }
}

/** Upload do graphql-upload expõe `.promise`; nos testes pode vir resolvido. */
export const resolveUpload = async (
  file: unknown,
): Promise<FileUpload> => {
  const upload = file as { promise?: Promise<FileUpload> } & FileUpload;
  return upload?.promise ? upload.promise : (upload as FileUpload);
};

class CloudinaryModel {
  /**
   * Envia a foto para `{authorId}/{spotId}` e devolve a URL segura. Rejeita
   * com FileTooLargeError se o arquivo passar de `maxBytes`.
   */
  async uploadImage(
    file: FileUpload,
    authorId: string,
    spotId: string,
    maxBytes: number,
  ): Promise<string> {
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      folder: `${authorId}/${spotId}`,
    };

    return new Promise<string>((resolve, reject) => {
      let received = 0;
      let tooLarge = false;

      const uploadStream = cloudinary.v2.uploader.upload_stream(
        options,
        (error, result?: UploadApiResponse) => {
          if (tooLarge) return;
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );

      const limiter = new Transform({
        transform(chunk, _encoding, callback) {
          received += chunk.length;
          if (received > maxBytes) {
            tooLarge = true;
            reject(new FileTooLargeError());
            callback();
            limiter.destroy();
            return;
          }
          callback(null, chunk);
        },
      });

      const source = file.createReadStream();
      source.on('error', (error: Error) => {
        // graphql-upload trunca acima do maxFileSize do middleware.
        reject(
          /exceeds/i.test(error.message) ? new FileTooLargeError() : error,
        );
      });

      source.pipe(limiter).pipe(uploadStream);
    });
  }
}

export const cloudinaryModel = new CloudinaryModel();
