import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import {
  createSpot,
  createSpotReview,
  createUser,
  tokenFor,
} from '../../../../test/factories';
import { prisma, useTestDatabase } from '../../../../test/db';

const MY_SPOTS = `query { mySpots { id name ratingAverage reviewsCount } }`;
const MY_REVIEWS = `query { myReviews { id rating description createdAt spot { id name modality } } }`;

describe('queries mySpots / myReviews (integração)', () => {
  useTestDatabase();

  it('mySpots lista só os picos do usuário, mais recentes primeiro, com média', async () => {
    const user = await createUser();
    const other = await createUser();
    const first = await createSpot({ authorId: user.id, name: 'Antigo' });
    await createSpot({ authorId: other.id, name: 'De outro' });
    const second = await createSpot({ authorId: user.id, name: 'Novo' });
    await prisma.spot.update({
      where: { id: first.id },
      data: { createdAt: new Date('2026-01-01') },
    });
    await createSpotReview({ spotId: second.id, rating: 4 });
    await createSpotReview({ spotId: second.id, rating: 5 });

    const { data, errors } = await executeAuthenticated(tokenFor(user), MY_SPOTS);

    expect(errors).toBeUndefined();
    expect(data.mySpots.map((s: { name: string }) => s.name)).toEqual([
      'Novo',
      'Antigo',
    ]);
    expect(data.mySpots[0]).toMatchObject({ ratingAverage: 4.5, reviewsCount: 2 });
    expect(data.mySpots[1]).toMatchObject({ ratingAverage: null, reviewsCount: 0 });
  });

  it('mySpots vazio devolve lista vazia', async () => {
    const user = await createUser();

    const { data, errors } = await executeAuthenticated(tokenFor(user), MY_SPOTS);

    expect(errors).toBeUndefined();
    expect(data.mySpots).toEqual([]);
  });

  it('myReviews lista só as avaliações do usuário, mais recentes primeiro, com o pico', async () => {
    const user = await createUser();
    const other = await createUser();
    const spotA = await createSpot({ name: 'Pico A', modality: 'park' });
    const spotB = await createSpot({ name: 'Pico B' });
    const older = await createSpotReview({ authorId: user.id, spotId: spotA.id, rating: 3 });
    await prisma.spotReview.update({
      where: { id: older.id },
      data: { createdAt: new Date('2026-01-01') },
    });
    await createSpotReview({
      authorId: user.id,
      spotId: spotB.id,
      rating: 5,
      description: null,
    });
    await createSpotReview({ authorId: other.id, spotId: spotA.id, rating: 1 });

    const { data, errors } = await executeAuthenticated(tokenFor(user), MY_REVIEWS);

    expect(errors).toBeUndefined();
    expect(data.myReviews).toHaveLength(2);
    expect(data.myReviews[0]).toMatchObject({
      rating: 5,
      description: null,
      spot: { id: spotB.id, name: 'Pico B' },
    });
    expect(data.myReviews[1]).toMatchObject({
      rating: 3,
      spot: { id: spotA.id, name: 'Pico A', modality: 'park' },
    });
    expect(new Date(data.myReviews[0].createdAt).toString()).not.toBe('Invalid Date');
  });

  it('myReviews vazio devolve lista vazia', async () => {
    const user = await createUser();

    const { data } = await executeAuthenticated(tokenFor(user), MY_REVIEWS);

    expect(data.myReviews).toEqual([]);
  });

  it('retorna UNAUTHENTICATED sem token', async () => {
    const spots = await executeAnonymous(MY_SPOTS);
    const reviews = await executeAnonymous(MY_REVIEWS);

    expect(spots.errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
    expect(reviews.errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
