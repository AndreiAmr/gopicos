import { useTestDatabase } from '../../../../test/db';
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

const GET_SPOT = `query ($id: String!) { getSpotById(id: $id) {
  id name coordinates ratingAverage reviewsCount isOwner author { id name }
} }`;

describe('getSpotById (integração)', () => {
  useTestDatabase();

  it('retorna campos, autor, média, contagem e isOwner=true para o autor', async () => {
    const author = await createUser({ name: 'Autor' });
    const spot = await createSpot({ authorId: author.id });
    await createSpotReview({ spotId: spot.id, rating: 5 });
    await createSpotReview({ spotId: spot.id, rating: 4 });

    const res = await executeAuthenticated(tokenFor(author), GET_SPOT, {
      id: spot.id,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.getSpotById).toMatchObject({
      id: spot.id,
      name: 'Pico Teste',
      author: { id: author.id, name: 'Autor' },
      ratingAverage: 4.5,
      reviewsCount: 2,
      isOwner: true,
    });
    expect(res.data.getSpotById.coordinates.type).toBe('Polygon');
  });

  it('isOwner=false para outro usuário', async () => {
    const spot = await createSpot();
    const other = await createUser();

    const res = await executeAuthenticated(tokenFor(other), GET_SPOT, {
      id: spot.id,
    });

    expect(res.data.getSpotById.isOwner).toBe(false);
  });

  it('pico sem avaliações tem média nula e contagem 0', async () => {
    const spot = await createSpot();
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), GET_SPOT, {
      id: spot.id,
    });

    expect(res.data.getSpotById.ratingAverage).toBeNull();
    expect(res.data.getSpotById.reviewsCount).toBe(0);
  });

  it('id inexistente retorna NOT_FOUND', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), GET_SPOT, {
      id: 'nao-existe',
    });

    expect(res.errors?.[0].extensions?.type).toBe('NOT_FOUND');
  });

  it('sem token retorna UNAUTHENTICATED', async () => {
    const spot = await createSpot();

    const res = await executeAnonymous(GET_SPOT, { id: spot.id });

    expect(res.errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
