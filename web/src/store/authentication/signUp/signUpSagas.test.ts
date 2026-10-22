import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runSagaIsolated } from '@/test-utils/runSaga';
import { navigate } from '@/routes/navigation';
import { URL } from '@/routes/url';

import { signUpActions } from './signUpActions';
import { signUpRepository } from './signUpRepository';
import { submitSignUpAsync } from './signUpSagas';
import type { ISignUpValues } from './signUpTypes';

vi.mock('./signUpRepository', () => ({
  signUpRepository: { signUp: vi.fn() },
}));
vi.mock('@/routes/navigation', () => ({ navigate: vi.fn() }));

const signUp = vi.mocked(signUpRepository.signUp);
const navigateMock = vi.mocked(navigate);

const values: ISignUpValues = {
  firstName: 'Marina',
  lastName: 'Souza',
  email: ' Marina@Exemplo.com ',
  emailConfirm: 'marina@exemplo.com',
  password: 'senha-forte-1',
  passwordConfirm: 'senha-forte-1',
};

const apolloError = (extensions: Record<string, unknown>, message = 'x') => ({
  graphQLErrors: [{ message, extensions }],
});

const run = () =>
  runSagaIsolated(submitSignUpAsync, [signUpActions.submitSignUpAsync(values)]);

describe('submitSignUpAsync', () => {
  beforeEach(() => vi.resetAllMocks());

  it('sucesso: vai ao login (replace) com e-mail e aviso, e limpa a memoria', async () => {
    signUp.mockResolvedValue('ok');

    const dispatched = await run();

    expect(signUp).toHaveBeenCalledWith({
      firstName: 'Marina',
      lastName: 'Souza',
      email: ' Marina@Exemplo.com ',
      password: 'senha-forte-1',
    });
    expect(navigateMock).toHaveBeenCalledWith(URL.LOGIN, {
      replace: true,
      state: { email: 'marina@exemplo.com', accountCreated: true },
    });
    expect(dispatched).toContainEqual(signUpActions.resetSignUp());
    expect(dispatched.at(-1)).toEqual(signUpActions.setIsLoadingSignUp(false));
  });

  it('EMAIL_ALREADY_EXISTS: volta ao passo 2 com erro no campo e-mail e dados preservados', async () => {
    signUp.mockRejectedValue(
      apolloError({ type: 'EMAIL_ALREADY_EXISTS', field: 'email' })
    );

    const dispatched = await run();

    expect(dispatched).toContainEqual(
      signUpActions.setSignUpFieldError({
        field: 'email',
        message: 'Este e-mail já tem cadastro.',
        type: 'EMAIL_ALREADY_EXISTS',
      })
    );
    expect(dispatched).not.toContainEqual(signUpActions.resetSignUp());
    expect(navigateMock).toHaveBeenCalledWith(URL.SIGN_UP_EMAIL, {
      replace: true,
    });
    expect(dispatched.at(-1)).toEqual(signUpActions.setIsLoadingSignUp(false));
  });

  it('VALIDATION_ERROR com campo: leva ao passo do campo com a mensagem do servidor', async () => {
    signUp.mockRejectedValue(
      apolloError(
        { type: 'VALIDATION_ERROR', field: 'lastName' },
        'Informe seu sobrenome.'
      )
    );

    const dispatched = await run();

    expect(dispatched).toContainEqual(
      signUpActions.setSignUpFieldError({
        field: 'lastName',
        message: 'Informe seu sobrenome.',
      })
    );
    expect(navigateMock).toHaveBeenCalledWith(URL.SIGN_UP, { replace: true });
  });

  it('VALIDATION_ERROR sem campo: banner no passo 3', async () => {
    signUp.mockRejectedValue(
      apolloError({ type: 'VALIDATION_ERROR' }, 'Aceite os termos.')
    );

    const dispatched = await run();

    expect(dispatched).toContainEqual(
      signUpActions.setSignUpBannerError('Aceite os termos.', false)
    );
    expect(navigateMock).toHaveBeenCalledWith(URL.SIGN_UP_PASSWORD, {
      replace: true,
    });
  });

  it('erro de rede: banner com "Tentar novamente" e sem trocar de passo', async () => {
    signUp.mockRejectedValue({ networkError: new Error('offline') });

    const dispatched = await run();

    expect(dispatched).toContainEqual(
      signUpActions.setSignUpBannerError(
        'Sem conexão. Verifique sua internet e tente de novo.',
        true
      )
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('erro inesperado: banner genérico, sem texto técnico', async () => {
    signUp.mockRejectedValue(new Error('boom'));

    const dispatched = await run();

    expect(dispatched).toContainEqual(
      signUpActions.setSignUpBannerError(
        'Algo deu errado do nosso lado. Tente de novo em instantes.',
        false
      )
    );
  });
});
