import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const { getMe, updateProfile, success, logout } = vi.hoisted(() => ({
  getMe: vi.fn(),
  updateProfile: vi.fn(),
  success: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('./userProfileRepository', () => ({
  userProfileRepository: { getMe, updateProfile },
}));
vi.mock('@/lib/notify', () => ({ notify: { success } }));
vi.mock('@/utils/logout', () => ({ logout }));

import { runSagaIsolated } from '@/test-utils/runSaga';
import { userProfileActions } from './userProfileActions';
import {
  PROFILE_UPDATED_MESSAGE,
  getMeAsync,
  updateProfileAsync,
} from './userProfileSagas';

const me = {
  id: '1',
  name: 'Ana Lima',
  firstName: 'Ana',
  lastName: 'Lima',
  email: 'a@b.com',
  createdAt: '2026-10-22T00:00:00.000Z',
  spotsCount: 1,
  reviewsCount: 2,
};

const apiError = (type: string, message = 'x', field?: string) =>
  new ApolloError({
    graphQLErrors: [new GraphQLError(message, { extensions: { type, field } })],
  });

beforeEach(() => vi.clearAllMocks());

describe('getMeAsync', () => {
  it('carrega o perfil e encerra o loading', async () => {
    getMe.mockResolvedValue(me);
    const actions = await runSagaIsolated(getMeAsync, []);

    expect(actions).toContainEqual(userProfileActions.setMe(me));
    expect(actions).toContainEqual(userProfileActions.setIsLoadingMe(false));
  });

  it('erro de rede grava o erro de carregamento', async () => {
    getMe.mockRejectedValue(new TypeError('Failed to fetch'));
    const actions = await runSagaIsolated(getMeAsync, []);

    expect(actions).toContainEqual(userProfileActions.setErrorMe('network'));
    expect(logout).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED encerra a sessão com aviso de sessão expirada', async () => {
    getMe.mockRejectedValue(apiError('UNAUTHENTICATED'));
    await runSagaIsolated(getMeAsync, []);

    expect(logout).toHaveBeenCalledWith({ sessionExpired: true });
  });
});

describe('updateProfileAsync', () => {
  const input = { firstName: 'Anna', lastName: 'Lima' };
  const run = () =>
    runSagaIsolated(updateProfileAsync, [userProfileActions.updateProfileAsync(input)]);

  it('sucesso atualiza o perfil e mostra o toast', async () => {
    const updated = { ...me, firstName: 'Anna', name: 'Anna Lima' };
    updateProfile.mockResolvedValue(updated);
    const actions = await run();

    expect(updateProfile).toHaveBeenCalledWith(input);
    expect(actions).toContainEqual(userProfileActions.setMe(updated));
    expect(success).toHaveBeenCalledWith(PROFILE_UPDATED_MESSAGE);
    expect(actions).toContainEqual(userProfileActions.setIsLoadingUpdate(false));
  });

  it('VALIDATION_ERROR com field vira erro de campo', async () => {
    updateProfile.mockRejectedValue(
      apiError('VALIDATION_ERROR', 'O nome pode ter no máximo 40 caracteres.', 'firstName'),
    );
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorUpdate({
        kind: 'field',
        field: 'firstName',
        message: 'O nome pode ter no máximo 40 caracteres.',
      }),
    );
    expect(success).not.toHaveBeenCalled();
  });

  it('erro de rede vira banner e preserva os dados', async () => {
    updateProfile.mockRejectedValue(new TypeError('Failed to fetch'));
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorUpdate({
        kind: 'banner',
        message: 'Sem conexão. Verifique sua internet e tente de novo.',
      }),
    );
    expect(actions).not.toContainEqual(expect.objectContaining({ payload: { me: expect.anything() } }));
  });

  it('UNAUTHENTICATED encerra a sessão', async () => {
    updateProfile.mockRejectedValue(apiError('UNAUTHENTICATED'));
    await run();

    expect(logout).toHaveBeenCalledWith({ sessionExpired: true });
  });
});
