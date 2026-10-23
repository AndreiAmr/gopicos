import {
  classifyLoginError,
  failureMessage,
  loginSchema,
  loginStrings,
} from './logic';

describe('classifyLoginError', () => {
  it('classifica INVALID_CREDENTIALS como credentials', () => {
    expect(
      classifyLoginError({
        type: 'INVALID_CREDENTIALS',
        message: 'x',
      } as never),
    ).toBe('credentials');
  });

  it('classifica erro sem ApiError como rede', () => {
    expect(classifyLoginError(null)).toBe('network');
  });

  it('classifica outros erros do servidor como server', () => {
    expect(classifyLoginError({ type: 'OTHER', message: 'x' } as never)).toBe(
      'server',
    );
  });

  it('nunca expõe o tipo técnico na mensagem', () => {
    expect(failureMessage('credentials')).toBe(loginStrings.invalidCredentials);
    expect(failureMessage('credentials')).not.toMatch(/INVALID/);
  });
});

describe('loginSchema', () => {
  it('rejeita campos vazios e e-mail inválido', async () => {
    await expect(
      loginSchema.validate({ email: '', password: '' }),
    ).rejects.toThrow();
    await expect(
      loginSchema.validate({ email: 'abc', password: '1' }),
    ).rejects.toThrow('Informe um e-mail válido.');
  });

  it('aceita credenciais bem formadas e não impõe tamanho de senha', async () => {
    await expect(
      loginSchema.validate({ email: 'a@b.com', password: '1' }),
    ).resolves.toBeTruthy();
  });
});
