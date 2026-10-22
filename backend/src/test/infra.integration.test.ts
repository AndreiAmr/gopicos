import { prisma, useTestDatabase } from './db';
import { createSpotReview, createUser, tokenFor } from './factories';
import { executeAnonymous, executeAuthenticated } from './graphql';

describe('infra de testes de integração', () => {
  useTestDatabase();

  it('cria dados com as factories', async () => {
    const review = await createSpotReview({ rating: 4 });

    expect(await prisma.user.count()).toBe(2);
    expect(await prisma.spot.count()).toBe(1);
    expect(review.rating).toBe(4);
  });

  it('limpa o banco entre os testes', async () => {
    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.spot.count()).toBe(0);
    expect(await prisma.spotReview.count()).toBe(0);
  });

  it('executa operações com e sem token', async () => {
    const user = await createUser();
    const query = '{ __typename }';

    const anon = await executeAnonymous(query);
    const auth = await executeAuthenticated(tokenFor(user), query);

    expect(anon.errors).toBeUndefined();
    expect(auth.data).toEqual({ __typename: 'Query' });
  });
});
