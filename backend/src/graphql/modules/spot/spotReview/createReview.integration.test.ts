import { prisma, useTestDatabase } from '../../../../test/db';
import { createSpot, createUser, tokenFor } from '../../../../test/factories';
import { executeAuthenticated } from '../../../../test/graphql';

const CREATE = `mutation ($data: SpotReview!) {
  createSpotReview(data: $data) { rating description }
}`;

const errorOf = (res: { errors?: { extensions?: any }[] }) =>
  res.errors?.[0].extensions;

describe('createSpotReview (integração)', () => {
  useTestDatabase();

  it('salva a avaliação e a média do pico é atualizada', async () => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      data: { spotId: spot.id, rating: 4, description: ' Bom pico ' },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createSpotReview).toEqual({
      rating: 4,
      description: 'Bom pico',
    });

    const details = await executeAuthenticated(
      tokenFor(user),
      `query { getSpotById(id: "${spot.id}") { ratingAverage reviewsCount } }`,
    );
    expect(details.data.getSpotById).toEqual({
      ratingAverage: 4,
      reviewsCount: 1,
    });
  });

  it('comentário é opcional', async () => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      data: { spotId: spot.id, rating: 5 },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.createSpotReview.description).toBeNull();
  });

  it('segunda avaliação do mesmo usuário retorna REVIEW_ALREADY_EXISTS', async () => {
    const user = await createUser();
    const spot = await createSpot();
    const data = { spotId: spot.id, rating: 3 };

    await executeAuthenticated(tokenFor(user), CREATE, { data });
    const res = await executeAuthenticated(tokenFor(user), CREATE, { data });

    expect(errorOf(res)?.type).toBe('REVIEW_ALREADY_EXISTS');
    expect(await prisma.spotReview.count()).toBe(1);
  });

  it.each([0, 6, -1])('nota %s retorna VALIDATION_ERROR', async (rating) => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      data: { spotId: spot.id, rating },
    });

    expect(errorOf(res)?.type).toBe('VALIDATION_ERROR');
    expect(await prisma.spotReview.count()).toBe(0);
  });

  it('nota não inteira é rejeitada', async () => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      data: { spotId: spot.id, rating: 4.5 },
    });

    expect(res.errors?.length).toBeGreaterThan(0);
    expect(await prisma.spotReview.count()).toBe(0);
  });

  it('comentário acima de 500 caracteres retorna VALIDATION_ERROR', async () => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      data: { spotId: spot.id, rating: 5, description: 'a'.repeat(501) },
    });

    expect(errorOf(res)).toMatchObject({
      type: 'VALIDATION_ERROR',
    });
  });

  it('autor do pico não avalia o próprio pico', async () => {
    const author = await createUser();
    const spot = await createSpot({ authorId: author.id });

    const res = await executeAuthenticated(tokenFor(author), CREATE, {
      data: { spotId: spot.id, rating: 5 },
    });

    expect(errorOf(res)?.type).toBe('OWN_SPOT_REVIEW');
  });

  it('pico inexistente retorna NOT_FOUND', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), CREATE, {
      data: { spotId: '00000000-0000-0000-0000-000000000000', rating: 5 },
    });

    expect(errorOf(res)?.type).toBe('NOT_FOUND');
  });
});
