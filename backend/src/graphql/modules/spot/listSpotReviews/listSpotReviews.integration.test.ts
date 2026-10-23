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

const LIST = `query ($spotId: String!, $first: Int, $after: String) {
  getSpotReviews(spotId: $spotId, first: $first, after: $after) {
    items { id rating description createdAt isMine author { id displayName } }
    nextCursor hasMore totalCount ratingAverage
    myReview { id rating isMine }
  }
}`;

/** Cria `n` avaliações com datas crescentes (a última é a mais recente). */
const seedReviews = async (spotId: string, n: number) => {
  const base = Date.now() - n * 60_000;
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const review = await createSpotReview({ spotId, rating: (i % 5) + 1 });
    await prisma.spotReview.update({
      where: { id: review.id },
      data: { createdAt: new Date(base + i * 60_000) },
    });
    ids.push(review.id);
  }
  return ids.reverse(); // mais recente primeiro
};

describe('getSpotReviews (integração)', () => {
  useTestDatabase();

  it('pagina 25 avaliações em páginas de 10, da mais recente para a mais antiga', async () => {
    const viewer = await createUser();
    const spot = await createSpot();
    const expected = await seedReviews(spot.id, 25);

    const collected: string[] = [];
    let after: string | null = null;
    const pages: number[] = [];

    do {
      const res: any = await executeAuthenticated(tokenFor(viewer), LIST, {
        spotId: spot.id,
        first: 10,
        after,
      });
      expect(res.errors).toBeUndefined();
      const page: any = res.data.getSpotReviews;
      expect(page.totalCount).toBe(25);
      pages.push(page.items.length);
      collected.push(...page.items.map((r: any) => r.id));
      after = page.nextCursor;
      expect(page.hasMore).toBe(after !== null);
    } while (after);

    expect(pages).toEqual([10, 10, 5]);
    expect(collected).toEqual(expected);
  });

  it('traz autor como "Nome S.", média e minha avaliação separada', async () => {
    const viewer = await createUser({ firstName: 'Eu', lastName: 'Mesmo' });
    const other = await createUser({ firstName: 'Marina', lastName: 'Silva' });
    const spot = await createSpot();
    await createSpotReview({ spotId: spot.id, authorId: other.id, rating: 4 });
    const mine = await createSpotReview({
      spotId: spot.id,
      authorId: viewer.id,
      rating: 5,
    });

    const res = await executeAuthenticated(tokenFor(viewer), LIST, {
      spotId: spot.id,
    });

    const page = res.data.getSpotReviews;
    expect(page.totalCount).toBe(2);
    expect(page.ratingAverage).toBe(4.5);
    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toMatchObject({
      rating: 4,
      isMine: false,
      author: { id: other.id, displayName: 'Marina S.' },
    });
    expect(page.myReview).toEqual({ id: mine.id, rating: 5, isMine: true });
  });

  it('autor desativado aparece como "Usuário Desativado"', async () => {
    const viewer = await createUser();
    const gone = await createUser();
    const spot = await createSpot();
    await createSpotReview({ spotId: spot.id, authorId: gone.id });
    await prisma.user.update({
      where: { id: gone.id },
      data: { deactivatedAt: new Date() },
    });

    const res = await executeAuthenticated(tokenFor(viewer), LIST, {
      spotId: spot.id,
    });

    expect(res.data.getSpotReviews.items[0].author.displayName).toBe(
      'Usuário Desativado',
    );
  });

  it('pico sem avaliações devolve página vazia', async () => {
    const viewer = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(viewer), LIST, {
      spotId: spot.id,
    });

    expect(res.data.getSpotReviews).toEqual({
      items: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
      ratingAverage: null,
      myReview: null,
    });
  });

  it('pico inexistente retorna NOT_FOUND', async () => {
    const viewer = await createUser();

    const res = await executeAuthenticated(tokenFor(viewer), LIST, {
      spotId: 'nao-existe',
    });

    expect(res.errors?.[0].extensions?.type).toBe('NOT_FOUND');
  });

  it.each([0, 51])('first=%s retorna VALIDATION_ERROR', async (first) => {
    const viewer = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(tokenFor(viewer), LIST, {
      spotId: spot.id,
      first,
    });

    expect(res.errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
  });

  it('cursor de outro pico retorna VALIDATION_ERROR', async () => {
    const viewer = await createUser();
    const spot = await createSpot();
    const otherReview = await createSpotReview();

    const res = await executeAuthenticated(tokenFor(viewer), LIST, {
      spotId: spot.id,
      after: otherReview.id,
    });

    expect(res.errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
  });

  it('sem token retorna UNAUTHENTICATED', async () => {
    const spot = await createSpot();

    const res = await executeAnonymous(LIST, { spotId: spot.id });

    expect(res.errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
