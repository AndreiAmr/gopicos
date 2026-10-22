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

const LIST = `query ($filter: SpotsFilter) { getAllSpots(filter: $filter) {
  id name isPaid ratingAverage reviewsCount
} }`;

describe('getAllSpots (integração)', () => {
  useTestDatabase();

  it('exige autenticação', async () => {
    const res = await executeAnonymous(LIST);

    expect(res.errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });

  it('retorna média (1 casa decimal) e contagem; sem avaliação vem nulo e 0', async () => {
    const user = await createUser();
    const rated = await createSpot({ name: 'Com nota' });
    await createSpot({ name: 'Sem nota' });
    await createSpotReview({ spotId: rated.id, rating: 5 });
    await createSpotReview({ spotId: rated.id, rating: 4 });
    await createSpotReview({ spotId: rated.id, rating: 4 });

    const res = await executeAuthenticated(tokenFor(user), LIST);

    expect(res.errors).toBeUndefined();
    const byName = Object.fromEntries(
      res.data.getAllSpots.map((s: any) => [s.name, s]),
    );
    expect(byName['Com nota']).toMatchObject({
      ratingAverage: 4.3,
      reviewsCount: 3,
    });
    expect(byName['Sem nota']).toMatchObject({
      ratingAverage: null,
      reviewsCount: 0,
    });
  });

  it('filtra por isPaid, modalidade e cobertura', async () => {
    const user = await createUser();
    await createSpot({ name: 'Grátis', isPaid: false });
    await createSpot({ name: 'Pago', isPaid: true, modality: 'park' });
    await createSpot({ name: 'Coberto', hasCoverage: true });

    const free = await executeAuthenticated(tokenFor(user), LIST, {
      filter: { isPaid: false },
    });
    expect(free.data.getAllSpots.map((s: any) => s.name).sort()).toEqual([
      'Coberto',
      'Grátis',
    ]);

    const park = await executeAuthenticated(tokenFor(user), LIST, {
      filter: { modality: 'park' },
    });
    expect(park.data.getAllSpots.map((s: any) => s.name)).toEqual(['Pago']);

    const covered = await executeAuthenticated(tokenFor(user), LIST, {
      filter: { hasCoverage: true },
    });
    expect(covered.data.getAllSpots.map((s: any) => s.name)).toEqual([
      'Coberto',
    ]);
  });

  it('minRating retorna só picos com média >= valor e exclui sem avaliação', async () => {
    const user = await createUser();
    const good = await createSpot({ name: 'Bom' });
    const bad = await createSpot({ name: 'Ruim' });
    await createSpot({ name: 'Sem nota' });
    await createSpotReview({ spotId: good.id, rating: 5 });
    await createSpotReview({ spotId: bad.id, rating: 2 });

    const res = await executeAuthenticated(tokenFor(user), LIST, {
      filter: { minRating: 4 },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.getAllSpots.map((s: any) => s.name)).toEqual(['Bom']);
  });

  it.each([0, 6])('minRating %s retorna VALIDATION_ERROR', async (value) => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), LIST, {
      filter: { minRating: value },
    });

    expect(res.errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
  });
});
