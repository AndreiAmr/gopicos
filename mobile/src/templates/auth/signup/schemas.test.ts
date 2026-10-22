import { signupSchema, STEP_FIELDS } from './schemas';

const valid = {
  firstName: 'Marina',
  lastName: 'Souza',
  email: 'marina@exemplo.com',
  confirmEmail: ' Marina@Exemplo.com ',
  password: 'senha-forte-123',
  confirmPassword: 'senha-forte-123',
};

const messageFor = async (override: object, path: string) => {
  try {
    await signupSchema.validate(
      { ...valid, ...override },
      { abortEarly: false },
    );
    return undefined;
  } catch (e) {
    return (e as { inner: { path: string; message: string }[] }).inner.find(
      i => i.path === path,
    )?.message;
  }
};

describe('signupSchema', () => {
  it('aceita dados válidos (confirmação de e-mail ignora caixa e espaços)', async () => {
    await expect(signupSchema.validate(valid)).resolves.toBeDefined();
  });

  it('exige nome e sobrenome com ao menos 2 caracteres', async () => {
    expect(await messageFor({ firstName: '  ' }, 'firstName')).toBe(
      'Informe seu nome.',
    );
    expect(await messageFor({ firstName: 'M' }, 'firstName')).toBe(
      'O nome precisa ter ao menos 2 caracteres.',
    );
    expect(await messageFor({ lastName: '' }, 'lastName')).toBe(
      'Informe seu sobrenome.',
    );
  });

  it('valida formato e confirmação do e-mail', async () => {
    expect(await messageFor({ email: 'abc' }, 'email')).toBe(
      'Informe um e-mail válido.',
    );
    expect(
      await messageFor({ confirmEmail: 'outro@x.com' }, 'confirmEmail'),
    ).toBe('Os e-mails não coincidem.');
    expect(await messageFor({ confirmEmail: '' }, 'confirmEmail')).toBe(
      'Confirme seu e-mail.',
    );
  });

  it('valida tamanho mínimo e confirmação da senha', async () => {
    expect(
      await messageFor(
        { password: '1234567', confirmPassword: '1234567' },
        'password',
      ),
    ).toBe('A senha precisa ter ao menos 8 caracteres.');
    expect(
      await messageFor({ confirmPassword: 'diferente' }, 'confirmPassword'),
    ).toBe('As senhas não coincidem.');
  });

  it('mapeia os campos por passo', () => {
    expect(STEP_FIELDS[1]).toEqual(['firstName', 'lastName']);
    expect(STEP_FIELDS[2]).toEqual(['email', 'confirmEmail']);
    expect(STEP_FIELDS[3]).toEqual(['password', 'confirmPassword']);
  });
});
