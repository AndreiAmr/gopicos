import { prisma, useTestDatabase } from '../../../../test/db';
import { createSpot, createUser, tokenFor } from '../../../../test/factories';
import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import { fakeUpload, uploadedFolders } from '../../../../test/uploads';

jest.mock('cloudinary', () => require('../../../../test/uploads').cloudinaryMock());

const UPDATE = `mutation ($id: String!, $input: UpdateSpotInput!) {
  updateSpot(id: $id, input: $input) { id name description images isPaid entryAmount coordinates }
}`;

const polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [-46.7, -23.5],
      [-46.6, -23.5],
      [-46.6, -23.6],
      [-46.7, -23.5],
    ],
  ],
};

const input = (over: Record<string, unknown> = {}) => ({
  name: '  Pico novo  ',
  description: 'Descrição nova.',
  modality: 'park',
  isPaid: true,
  entryAmount: 'R$ 10',
  alwaysOpen: true,
  hasCoverage: true,
  equipmentRequired: false,
  coordinates: polygon,
  ...over,
});

const errorOf = (res: { errors?: { extensions?: any }[] }) =>
  res.errors?.[0].extensions;

const seedSpot = async (authorId: string, images: string[] = ['a.jpg', 'b.jpg']) => {
  const spot = await createSpot({ authorId });
  return prisma.spot.update({ where: { id: spot.id }, data: { images } });
};

describe('updateSpot (integração)', () => {
  useTestDatabase();

  beforeEach(() => {
    uploadedFolders.length = 0;
  });

  it('autor atualiza campos e geometria; mantém as fotos quando keepImages é omitido', async () => {
    const author = await createUser();
    const spot = await seedSpot(author.id);

    const res = await executeAuthenticated(tokenFor(author), UPDATE, {
      id: spot.id,
      input: input(),
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.updateSpot).toMatchObject({
      id: spot.id,
      name: 'Pico novo',
      isPaid: true,
      entryAmount: 'R$ 10',
      images: ['a.jpg', 'b.jpg'],
      coordinates: polygon,
    });
    const saved = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
    expect(saved.authorId).toBe(author.id);
    expect(saved.modality).toBe('park');
  });

  it('remove e adiciona fotos (pasta autor/pico)', async () => {
    const author = await createUser();
    const spot = await seedSpot(author.id);

    const res = await executeAuthenticated(tokenFor(author), UPDATE, {
      id: spot.id,
      input: input({ keepImages: ['b.jpg'], newImages: [fakeUpload()] }),
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.updateSpot.images).toHaveLength(2);
    expect(res.data.updateSpot.images[0]).toBe('b.jpg');
    expect(uploadedFolders).toEqual([`${author.id}/${spot.id}`]);
  });

  it('não-autor recebe FORBIDDEN e nada muda', async () => {
    const author = await createUser();
    const other = await createUser();
    const spot = await seedSpot(author.id);

    const res = await executeAuthenticated(tokenFor(other), UPDATE, {
      id: spot.id,
      input: input(),
    });

    expect(errorOf(res)).toMatchObject({ type: 'FORBIDDEN' });
    const saved = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
    expect(saved.name).toBe('Pico Teste');
  });

  it('pico inexistente retorna NOT_FOUND', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), UPDATE, {
      id: '00000000-0000-0000-0000-000000000000',
      input: input(),
    });

    expect(errorOf(res)).toMatchObject({ type: 'NOT_FOUND' });
  });

  it('sem token retorna UNAUTHENTICATED', async () => {
    const author = await createUser();
    const spot = await seedSpot(author.id);

    const res = await executeAnonymous(UPDATE, { id: spot.id, input: input() });

    expect(errorOf(res)).toMatchObject({ type: 'UNAUTHENTICATED' });
  });

  it.each([
    ['name', { name: ' ' }],
    ['coordinates', { coordinates: null }],
    ['images', { keepImages: [] }],
    ['images', { keepImages: ['outra.jpg'] }],
    ['images', { keepImages: ['a.jpg'], newImages: Array.from({ length: 5 }, () => fakeUpload()) }],
    ['images', { newImages: [fakeUpload({ mimetype: 'application/pdf' })] }],
  ])('campo %s inválido retorna VALIDATION_ERROR e não grava', async (field, over) => {
    const author = await createUser();
    const spot = await seedSpot(author.id);

    const res = await executeAuthenticated(tokenFor(author), UPDATE, {
      id: spot.id,
      input: input(over),
    });

    expect(errorOf(res)).toMatchObject({ type: 'VALIDATION_ERROR', field });
    const saved = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
    expect(saved.name).toBe('Pico Teste');
    expect(saved.images).toEqual(['a.jpg', 'b.jpg']);
  });
});
