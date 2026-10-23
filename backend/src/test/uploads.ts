import { Readable, Writable } from 'stream';

/**
 * Upload falso no formato do graphql-upload (`{ promise }`), para passar como
 * variável `Upload` em `executeAuthenticated`.
 */
export const fakeUpload = ({
  filename = 'foto.jpg',
  mimetype = 'image/jpeg',
  bytes = 1024,
}: { filename?: string; mimetype?: string; bytes?: number } = {}) => ({
  promise: Promise.resolve({
    filename,
    mimetype,
    encoding: '7bit',
    createReadStream: () => Readable.from([Buffer.alloc(bytes)]),
  }),
});

/** URLs "enviadas" pelo mock do Cloudinary, na ordem. */
export const uploadedFolders: string[] = [];

/**
 * Fábrica para `jest.mock('cloudinary', () => require('../test/uploads').cloudinaryMock())`:
 * consome o stream e devolve uma URL fake com a pasta usada.
 */
export const cloudinaryMock = () => ({
  __esModule: true,
  default: {
    v2: {
      config: () => undefined,
      uploader: {
        upload_stream: (
          options: { folder: string },
          callback: (error: unknown, result?: { secure_url: string }) => void,
        ) =>
          new Writable({
            write(_chunk, _encoding, next) {
              next();
            },
            final(done) {
              uploadedFolders.push(options.folder);
              callback(null, {
                secure_url: `https://res.cloudinary.test/${options.folder}/${uploadedFolders.length}.jpg`,
              });
              done();
            },
          }),
      },
    },
  },
});
