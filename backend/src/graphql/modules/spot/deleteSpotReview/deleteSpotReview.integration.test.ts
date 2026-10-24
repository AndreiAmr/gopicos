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

const DELETE = `mutation ($id: String!) {
  deleteSpotReview(id: $id) { id spotId }
}`;

const CREATE = `mutation ($data: SpotReview!) {
  createSpotReview(data: $data) { rating }
}`;

const errorOf = (res: { errors?: { extensions?: any }[] }) =>
  res.errors?.[0].extensions;

describe('deleteSpotReview (integração)', () => {
  useTestDatabase();

  it('autor exclui, a média é recalculada e pode avaliar de novo', async () => {
    const author = await createUser();
    const spot = await createSpot();
    const review = await createSpotReview({
      spotId: spot.id,
      authorId: author.id,
      rating: 1,
    });
    await createSpotReview({ spotId: spot.id, rating: 5 });

    const res = await executeAuthenticated(tokenFor(author), DELETE, {
      id: review.id,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.deleteSpotReview).toEqual({
      id: review.id,
      spotId: spot.id,
    });
    expect(
      await prisma.spotReview.findUnique({ where: { id: review.id } }),
    ).toBeNull();

    const details = await executeAuthenticated(
      tokenFor(author),
      `query { getSpotById(id: "${spot.id}") { ratingAverage reviewsCount } }`,
    );
    expect(details.data.getSpotById).toEqual({
      ratingAverage: 5,
      reviewsCount: 1,
    });

    const again = await executeAuthenticated(tokenFor(author), CREATE, {
      data: { spotId: spot.id, rating: 3 },
    });
    expect(again.errors).toBeUndefined();
  });

  it('não autor recebe FORBIDDEN e nada é removido', async () => {
    const review = await createSpotReview();
    const other = await createUser();

    const res = await executeAuthenticated(tokenFor(other), DELETE, {
      id: review.id,
    });

    expect(errorOf(res)?.type).toBe('FORBIDDEN');
    expect(
      await prisma.spotReview.findUnique({ where: { id: review.id } }),
    ).not.toBeNull();
  });

  it('avaliação inexistente retorna NOT_FOUND', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), DELETE, {
      id: 'nao-existe',
    });

    expect(errorOf(res)?.type).toBe('NOT_FOUND');
  });

  it('sem token retorna UNAUTHENTICATED', async () => {
    const review = await createSpotReview();

    const res = await executeAnonymous(DELETE, { id: review.id });

    expect(errorOf(res)?.type).toBe('UNAUTHENTICATED');
    expect(
      await prisma.spotReview.findUnique({ where: { id: review.id } }),
    ).not.toBeNull();
  });
});
