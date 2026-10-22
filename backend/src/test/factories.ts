import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { generateToken } from '../utils/jwt';
import { prisma } from './db';

export const DEFAULT_PASSWORD = 'senha123';

export const createUser = async (
  overrides: Partial<{ firstName: string; lastName: string; email: string; password: string }> = {},
) => {
  const password = overrides.password ?? DEFAULT_PASSWORD;

  const user = await prisma.user.create({
    data: {
      firstName: overrides.firstName ?? 'Usuário',
      lastName: overrides.lastName ?? 'Teste',
      email: overrides.email ?? `user-${randomUUID()}@test.com`,
      // custo baixo: só acelera os testes
      password: await bcrypt.hash(password, 4),
    },
  });

  return { ...user, plainPassword: password };
};

/** Token JWT válido para o usuário informado. */
export const tokenFor = (user: { id: string; email: string }) =>
  generateToken({ id: user.id, email: user.email }).token;

export const createSpot = async (
  overrides: Partial<{
    authorId: string;
    name: string;
    description: string;
    modality:
      | 'street'
      | 'park'
      | 'bowl_pool'
      | 'vertical'
      | 'downhill'
      | 'mixed';
  }> = {},
) => {
  const authorId = overrides.authorId ?? (await createUser()).id;

  return prisma.spot.create({
    data: {
      name: overrides.name ?? 'Pico Teste',
      description: overrides.description ?? 'Descrição do pico de teste',
      authorId,
      modality: overrides.modality ?? 'street',
      equipmentRequired: false,
      isPaid: false,
      alwaysOpen: true,
      hasCoverage: false,
      // GeoJSON em ordem [lng, lat]
      coordinates: {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.56],
            [-46.65, -23.56],
            [-46.65, -23.55],
          ],
        ],
      },
      images: [],
    },
  });
};

export const createSpotReview = async (
  overrides: Partial<{
    spotId: string;
    authorId: string;
    rating: number;
    description: string | null;
  }> = {},
) => {
  const spotId = overrides.spotId ?? (await createSpot()).id;
  const authorId = overrides.authorId ?? (await createUser()).id;

  return prisma.spotReview.create({
    data: {
      spotId,
      authorId,
      rating: overrides.rating ?? 5,
      description:
        overrides.description === undefined
          ? 'Pico bom'
          : overrides.description,
    },
  });
};
