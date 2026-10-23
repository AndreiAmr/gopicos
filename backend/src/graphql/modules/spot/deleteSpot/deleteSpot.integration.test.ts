import { prisma, useTestDatabase } from '../../../../test/db';
import {
  createSpot,
  createSpotReview,
  createUser,
  tokenFor,
} from '../../../../test/factories';
import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import { deletedFolders } from '../../../../test/uploads';

jest.mock('cloudinary', () =>
  require('../../../../test/uploads').cloudinaryMock(),
);

const DELETE = `mutation ($id: String!) { deleteSpot(id: $id) { id } }`;

describe('deleteSpot (integração)', () => {
  useTestDatabase();

  beforeEach(() => {
    deletedFolders.length = 0;
  });

  it('autor exclui o pico, as avaliações em cascata e as fotos do Cloudinary', async () => {
    const author = await createUser();
    const spot = await createSpot({ authorId: author.id });
    await createSpotReview({ spotId: spot.id });
    await createSpotReview({ spotId: spot.id });

    const res = await executeAuthenticated(tokenFor(author), DELETE, {
      id: spot.id,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.deleteSpot).toEqual({ id: spot.id });
    expect(await prisma.spot.findUnique({ where: { id: spot.id } })).toBeNull();
    expect(await prisma.spotReview.count({ where: { spotId: spot.id } })).toBe(
      0,
    );
    expect(deletedFolders).toEqual([`${author.id}/${spot.id}`]);
  });

  it('não autor recebe FORBIDDEN e nada é removido', async () => {
    const spot = await createSpot();
    await createSpotReview({ spotId: spot.id });
    const other = await createUser();

    const res = await executeAuthenticated(tokenFor(other), DELETE, {
      id: spot.id,
    });

    expect(res.errors?.[0].extensions?.type).toBe('FORBIDDEN');
    expect(
      await prisma.spot.findUnique({ where: { id: spot.id } }),
    ).not.toBeNull();
    expect(await prisma.spotReview.count({ where: { spotId: spot.id } })).toBe(
      1,
    );
    expect(deletedFolders).toEqual([]);
  });

  it('pico inexistente retorna NOT_FOUND', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), DELETE, {
      id: 'nao-existe',
    });

    expect(res.errors?.[0].extensions?.type).toBe('NOT_FOUND');
  });

  it('sem token retorna UNAUTHENTICATED', async () => {
    const spot = await createSpot();

    const res = await executeAnonymous(DELETE, { id: spot.id });

    expect(res.errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
    expect(
      await prisma.spot.findUnique({ where: { id: spot.id } }),
    ).not.toBeNull();
  });
});
