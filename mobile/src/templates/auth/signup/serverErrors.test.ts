import {
  mapSignupError,
  NETWORK_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from './serverErrors';

describe('mapSignupError', () => {
  it('EMAIL_ALREADY_EXISTS volta ao passo 2', () => {
    expect(
      mapSignupError({
        errors: [{ type: 'EMAIL_ALREADY_EXISTS', message: 'x' }],
      }),
    ).toEqual({ kind: 'emailTaken', step: 2 });
  });

  it('VALIDATION_ERROR com campo leva ao passo do campo com a mensagem do servidor', () => {
    expect(
      mapSignupError({
        errors: [
          {
            type: 'VALIDATION_ERROR',
            message: 'Senha fraca',
            extensions: { field: 'password' },
          },
        ],
      }),
    ).toEqual({
      kind: 'field',
      step: 3,
      field: 'password',
      message: 'Senha fraca',
    });
    expect(
      mapSignupError({
        errors: [
          {
            type: 'VALIDATION_ERROR',
            message: 'Nome curto',
            extensions: { field: 'lastName' },
          },
        ],
      }),
    ).toMatchObject({ step: 1, field: 'lastName' });
  });

  it('VALIDATION_ERROR sem campo conhecido vira banner com a mensagem do servidor', () => {
    expect(
      mapSignupError({
        errors: [{ type: 'VALIDATION_ERROR', message: 'Inválido' }],
      }),
    ).toEqual({ kind: 'banner', message: 'Inválido' });
  });

  it('erro de rede e erro inesperado viram banner', () => {
    expect(mapSignupError(new Error('Network request failed'))).toEqual({
      kind: 'banner',
      message: NETWORK_ERROR_MESSAGE,
    });
    expect(
      mapSignupError({ errors: [{ type: 'INTERNAL_ERROR', message: 'boom' }] }),
    ).toEqual({
      kind: 'banner',
      message: SERVER_ERROR_MESSAGE,
    });
  });
});
