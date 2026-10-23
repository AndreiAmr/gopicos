import { prisma, useTestDatabase } from '../../../../test/db';
import { createUser, tokenFor } from '../../../../test/factories';
import { executeAuthenticated } from '../../../../test/graphql';
import { fakeUpload, uploadedFolders } from '../../../../test/uploads';

jest.mock('cloudinary', () => require('../../../../test/uploads').cloudinaryMock());

const CREATE = `mutation ($input: NewSpotInput!) {
  createSpot(input: $input) { id name entryAmount openingHours coordinates }
}`;

const polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [-46.65, -23.55],
      [-46.64, -23.55],
      [-46.64, -23.56],
      [-46.65, -23.55],
    ],
  ],
};

const validInput = (over: Record<string, unknown> = {}) => ({
  name: '  Pico da Praça  ',
  description: 'Corrimão e escadas.',
  modality: 'street',
  isPaid: false,
  alwaysOpen: true,
  hasCoverage: false,
  equipmentRequired: false,
  coordinates: polygon,
  images: [fakeUpload()],
  ...over,
});

const errorOf = (res: { errors?: { extensions?: any }[] }) =>
  res.errors?.[0].extensions;

describe('createSpot (integração)', () => {
  useTestDatabase();

  beforeEach(() => {
    uploadedFolders.length = 0;
  });

  it('salva com fotos no Cloudinary (pasta autor/pico) e authorId do token', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      input: validInput({ images: [fakeUpload(), fakeUpload()] }),
    });

    expect(res.errors).toBeUndefined();
    const saved = await prisma.spot.findUniqueOrThrow({
      where: { id: res.data.createSpot.id },
    });
    expect(saved.name).toBe('Pico da Praça');
    expect(saved.authorId).toBe(user.id);
    expect(saved.images).toHaveLength(2);
    expect(uploadedFolders).toEqual([
      `${user.id}/${saved.id}`,
      `${user.id}/${saved.id}`,
    ]);
    expect(saved.entryAmount).toBeNull();
    expect(saved.openingHours).toBeNull();
  });

  it('pago com valor e horário informado', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      input: validInput({
        isPaid: true,
        entryAmount: 'R$ 20',
        alwaysOpen: false,
        openingHours: '8h às 22h',
      }),
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createSpot).toMatchObject({
      entryAmount: 'R$ 20',
      openingHours: '8h às 22h',
    });
  });

  it.each([
    ['name', { name: '  ' }],
    ['name', { name: 'a'.repeat(81) }],
    ['description', { description: '' }],
    ['description', { description: 'a'.repeat(1001) }],
    ['modality', { modality: 'skate' }],
    ['entryAmount', { isPaid: true, entryAmount: '' }],
    ['openingHours', { alwaysOpen: false, openingHours: null }],
    ['coordinates', { coordinates: null }],
    [
      'coordinates',
      {
        coordinates: {
          type: 'Polygon',
          coordinates: [[[-46.65, -23.55], [-46.64, -23.55], [-46.65, -23.55]]],
        },
      },
    ],
    [
      'coordinates',
      {
        coordinates: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.65, -23.55],
              [-46.64, -23.55],
              [-46.64, -23.56],
              [-46.6, -23.5],
            ],
          ],
        },
      },
    ],
    [
      'coordinates',
      {
        coordinates: {
          type: 'Polygon',
          coordinates: [[[200, -23.55], [-46.64, -23.55], [-46.64, -23.56], [200, -23.55]]],
        },
      },
    ],
    ['images', { images: [] }],
    ['images', { images: Array.from({ length: 6 }, () => fakeUpload()) }],
    ['images', { images: [fakeUpload({ mimetype: 'application/pdf' })] }],
    ['images', { images: [fakeUpload({ bytes: 5 * 1024 * 1024 + 1 })] }],
  ])('campo %s inválido retorna VALIDATION_ERROR e não grava', async (field, over) => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      input: validInput(over),
    });

    expect(errorOf(res)).toMatchObject({ type: 'VALIDATION_ERROR', field });
    expect(res.errors?.[0]).toHaveProperty('message');
    expect(await prisma.spot.count()).toBe(0);
  });

  it('não envia fotos quando um campo é inválido', async () => {
    const user = await createUser();

    await executeAuthenticated(tokenFor(user), CREATE, {
      input: validInput({ modality: 'x' }),
    });

    expect(uploadedFolders).toHaveLength(0);
  });
});
