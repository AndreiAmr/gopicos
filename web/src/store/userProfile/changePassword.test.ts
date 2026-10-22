import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const { changePassword, success, logout } = vi.hoisted(() => ({
  changePassword: vi.fn(),
  success: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('./userProfileRepository', () => ({
  userProfileRepository: { changePassword },
}));
vi.mock('@/lib/notify', () => ({ notify: { success } }));
vi.mock('@/utils/logout', () => ({ logout }));

import { runSagaIsolated } from '@/test-utils/runSaga';
import { userProfileActions } from './userProfileActions';
import {
  PASSWORD_CHANGED_MESSAGE,
  WRONG_CURRENT_PASSWORD_MESSAGE,
  changePasswordAsync,
} from './userProfileSagas';

const apiError = (type: string, message = 'x', field?: string) =>
  new ApolloError({
    graphQLErrors: [new GraphQLError(message, { extensions: { type, field } })],
  });

const input = { currentPassword: 'atual1234', newPassword: 'novaSenha123' };
const run = () =>
  runSagaIsolated(changePasswordAsync, [
    userProfileActions.changePasswordAsync(input),
  ]);

beforeEach(() => vi.clearAllMocks());

describe('changePasswordAsync', () => {
  it('sucesso avisa, sinaliza para limpar o formulário e não encerra a sessão', async () => {
    changePassword.mockResolvedValue(undefined);
    const actions = await run();

    expect(changePassword).toHaveBeenCalledWith(input);
    expect(actions).toContainEqual(userProfileActions.setSuccessPassword(true));
    expect(success).toHaveBeenCalledWith(PASSWORD_CHANGED_MESSAGE);
    expect(logout).not.toHaveBeenCalled();
  });

  it('INVALID_CREDENTIALS vira erro no campo da senha atual', async () => {
    changePassword.mockRejectedValue(apiError('INVALID_CREDENTIALS'));
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorPassword({
        kind: 'field',
        field: 'currentPassword',
        message: WRONG_CURRENT_PASSWORD_MESSAGE,
      }),
    );
    expect(success).not.toHaveBeenCalled();
  });

  it('VALIDATION_ERROR de newPassword vai ao campo', async () => {
    changePassword.mockRejectedValue(
      apiError('VALIDATION_ERROR', 'A senha deve ter no mínimo 8 caracteres.', 'newPassword'),
    );
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorPassword({
        kind: 'field',
        field: 'newPassword',
        message: 'A senha deve ter no mínimo 8 caracteres.',
      }),
    );
  });

  it('erro de rede vira banner', async () => {
    changePassword.mockRejectedValue(new TypeError('Failed to fetch'));
    const actions = await run();

    expect(actions).toContainEqual(
      userProfileActions.setErrorPassword({
        kind: 'banner',
        message: 'Sem conexão. Verifique sua internet e tente de novo.',
      }),
    );
  });

  it('UNAUTHENTICATED encerra a sessão', async () => {
    changePassword.mockRejectedValue(apiError('UNAUTHENTICATED'));
    await run();

    expect(logout).toHaveBeenCalledWith({ sessionExpired: true });
  });
});
