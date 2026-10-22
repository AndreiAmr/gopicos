import { prisma, useTestDatabase } from '../test/db';
import { createSpot, createUser, tokenFor } from '../test/factories';
import { executeAnonymous, executeAuthenticated } from '../test/graphql';

const CREATE_SPOT = `mutation { createSpot(input: { name: "Pico", description: "d", modality: "street", isPaid: false, alwaysOpen: true, coordinates: { type: "Polygon", coordinates: [[[-46.65, -23.55], [-46.64, -23.55], [-46.64, -23.56], [-46.65, -23.55]]] } }) { id name } }`;
const createReview = (spotId: string, extra = '') =>
  `mutation { createSpotReview(data: { spotId: "${spotId}", rating: 5, description: "top" ${extra} }) { rating description } }`;

const errorType = (res: { errors?: { extensions?: { type?: string } }[] }) =>
  res.errors?.[0].extensions?.type;

describe('proteção das operações de pico (integração)', () => {
  useTestDatabase();

  it('createSpot sem token retorna UNAUTHENTICATED e não grava', async () => {
    const res = await executeAnonymous(CREATE_SPOT);

    expect(errorType(res)).toBe('UNAUTHENTICATED');
    expect(await prisma.spot.count()).toBe(0);
  });

  it('createSpot salva com authorId igual ao id do token', async () => {
    const user = await createUser();

    const res = await executeAuthenticated(tokenFor(user), CREATE_SPOT);

    expect(res.errors).toBeUndefined();
    const saved = await prisma.spot.findUniqueOrThrow({
      where: { id: res.data.createSpot.id },
    });
    expect(saved.authorId).toBe(user.id);
  });

  it('createSpotReview sem token retorna UNAUTHENTICATED e não grava', async () => {
    const spot = await createSpot();

    const res = await executeAnonymous(createReview(spot.id));

    expect(errorType(res)).toBe('UNAUTHENTICATED');
    expect(await prisma.spotReview.count()).toBe(0);
  });

  it('createSpotReview usa o autor do token', async () => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(
      tokenFor(user),
      createReview(spot.id),
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.createSpotReview).toEqual({
      rating: 5,
      description: 'top',
    });
    const saved = await prisma.spotReview.findFirstOrThrow();
    expect(saved.authorId).toBe(user.id);
    expect(saved.spotId).toBe(spot.id);
  });

  it('createSpotReview rejeita authorId vindo no input', async () => {
    const user = await createUser();
    const spot = await createSpot();

    const res = await executeAuthenticated(
      tokenFor(user),
      createReview(spot.id, ', authorId: "outro"'),
    );

    expect(res.errors?.length).toBeGreaterThan(0);
    expect(await prisma.spotReview.count()).toBe(0);
  });

  it('token de usuário desativado é rejeitado', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: { deactivatedAt: new Date() },
    });

    const res = await executeAuthenticated(tokenFor(user), CREATE_SPOT);

    expect(errorType(res)).toBe('UNAUTHENTICATED');
    expect(await prisma.spot.count()).toBe(0);
  });

  it('token de usuário inexistente é rejeitado', async () => {
    const res = await executeAuthenticated(
      tokenFor({ id: 'fantasma', email: 'f@test.com' }),
      CREATE_SPOT,
    );

    expect(errorType(res)).toBe('UNAUTHENTICATED');
  });
});
