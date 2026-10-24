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

const UPDATE = `mutation ($id: String!, $data: UpdateSpotReview!) {
  updateSpotReview(id: $id, data: $data) {
    id rating description isMine author { displayName }
  }
}`;

const errorOf = (res: { errors?: { extensions?: any }[] }) =>
  res.errors?.[0].extensions;

const average = async (token: string, spotId: string) => {
  const res = await executeAuthenticated(
    token,
    `query { getSpotById(id: "${spotId}") { ratingAverage reviewsCount } }`,
  );
  return res.data.getSpotById;
};

describe('updateSpotReview (integração)', () => {
  useTestDatabase();

  it('autor edita nota e comentário e a média é recalculada', async () => {
    const author = await createUser();
    const spot = await createSpot();
    const review = await createSpotReview({
      spotId: spot.id,
      authorId: author.id,
      rating: 2,
    });
    await createSpotReview({ spotId: spot.id, rating: 4 });

    const res = await executeAuthenticated(tokenFor(author), UPDATE, {
      id: review.id,
      data: { rating: 5, description: ' Melhorou muito ' },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.updateSpotReview).toMatchObject({
      id: review.id,
      rating: 5,
      description: 'Melhorou muito',
      isMine: true,
    });
    expect(await average(tokenFor(author), spot.id)).toEqual({
      ratingAverage: 4.5,
      reviewsCount: 2,
    });
  });

  it('comentário vazio remove o comentário anterior', async () => {
    const author = await createUser();
    const review = await createSpotReview({ authorId: author.id });

    const res = await executeAuthenticated(tokenFor(author), UPDATE, {
      id: review.id,
      data: { rating: 3, description: '   ' },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.updateSpotReview.description).toBeNull();
  });

  it('não autor recebe FORBIDDEN e nada muda', async () => {
    const review = await createSpotReview({ rating: 2 });
    const other = await createUser();

    const res = await executeAuthenticated(tokenFor(other), UPDATE, {
      id: review.id,
      data: { rating: 5 },
    });

    expect(errorOf(res)?.type).toBe('FORBIDDEN');
    const stored = await prisma.spotReview.findUnique({
      where: { id: review.id },
    });
    expect(stored?.rating).toBe(2);
  });

  it('nota inválida retorna VALIDATION_ERROR no campo rating', async () => {
    const author = await createUser();
    const review = await createSpotReview({ authorId: author.id });

    const res = await executeAuthenticated(tokenFor(author), UPDATE, {
      id: review.id,
      data: { rating: 4.5 },
    });

    expect(errorOf(res)).toMatchObject({
      type: 'VALIDATION_ERROR',
      field: 'rating',
    });
  });

  it('avaliação inexistente retorna NOT_FOUND', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), UPDATE, {
      id: 'nao-existe',
      data: { rating: 3 },
    });

    expect(errorOf(res)?.type).toBe('NOT_FOUND');
  });

  it('sem token retorna UNAUTHENTICATED', async () => {
    const review = await createSpotReview();

    const res = await executeAnonymous(UPDATE, {
      id: review.id,
      data: { rating: 1 },
    });

    expect(errorOf(res)?.type).toBe('UNAUTHENTICATED');
  });
});
