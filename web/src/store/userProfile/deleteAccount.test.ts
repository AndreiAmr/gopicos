import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const { deleteAccount, logout } = vi.hoisted(() => ({
  deleteAccount: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('./userProfileRepository', () => ({
  userProfileRepository: { deleteAccount },
}));
vi.mock('@/lib/notify', () => ({ notify: { success: vi.fn() } }));
vi.mock('@/utils/logout', () => ({ logout }));

import { runSagaIsolated } from '@/test-utils/runSaga';
import { userProfileActions } from './userProfileActions';
import { WRONG_PASSWORD_MESSAGE, deleteAccountAsync } from './userProfileSagas';
import { USER_PROFILE_INITIAL_STATE } from './userProfileReducer';

const apiError = (type: string, message = 'x', field?: string) =>
  new ApolloError({
    graphQLErrors: [new GraphQLError(message, { extensions: { type, field } })],
  });

const state = {
  UserProfile: {
    ...USER_PROFILE_INITIAL_STATE,
    me: {
      ...USER_PROFILE_INITIAL_STATE.me,
      data: { id: '1', email: 'a@b.com' },
    },
  },
};

const run = () =>
  runSagaIsolated(
    deleteAccountAsync,
    [userProfileActions.deleteAccountAsync('senha123')],
    state,
  );

beforeEach(() => vi.clearAllMocks());

describe('deleteAccountAsync', () => {
  it('sucesso encerra a sessão e vai ao Login com o aviso e o e-mail', async () => {
    deleteAccount.mockResolvedValue(undefined);
    const actions = await run();

    expect(deleteAccount).toHaveBeenCalledWith('senha123');
    expect(logout).toHaveBeenCalledWith({
      accountDeleted: true,
      email: 'a@b.com',
    });
    expect(actions).toContainEqual(userProfileActions.setIsLoadingDelete(false));
  });

  it('senha incorreta vira erro no campo e mantém a sessão', async () => {
    deleteAccount.mockRejectedValue(apiError('INVALID_CREDENTIALS'));
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorDelete({
        kind: 'field',
        field: 'password',
        message: WRONG_PASSWORD_MESSAGE,
      }),
    );
    expect(logout).not.toHaveBeenCalled();
  });

  it('erro de rede vira banner e nada é apagado localmente', async () => {
    deleteAccount.mockRejectedValue(new TypeError('Failed to fetch'));
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorDelete({
        kind: 'banner',
        message: 'Sem conexão. Verifique sua internet e tente de novo.',
      }),
    );
    expect(logout).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED leva ao Login de sessão expirada', async () => {
    deleteAccount.mockRejectedValue(apiError('UNAUTHENTICATED'));
    await run();

    expect(logout).toHaveBeenCalledWith({ sessionExpired: true });
  });
});
