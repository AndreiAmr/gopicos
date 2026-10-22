import { describe, expect, it } from 'vitest';

import {
  arePreviousStepsValid,
  emailStepSchema,
  nameStepSchema,
  passwordStepSchema,
} from './signUpSchemas';

const messages = async (
  schema: { validate: (v: unknown, o: object) => Promise<unknown> },
  value: unknown
) => {
  try {
    await schema.validate(value, { abortEarly: false });
    return [];
  } catch (error) {
    return (error as { errors: string[] }).errors;
  }
};

describe('nameStepSchema', () => {
  it('exige nome e sobrenome (só espaços conta como vazio)', async () => {
    const errors = await messages(nameStepSchema, { firstName: '  ', lastName: '' });
    expect(errors).toContain('Informe seu nome.');
    expect(errors).toContain('Informe seu sobrenome.');
  });

  it('exige ao menos 2 caracteres', async () => {
    expect(await messages(nameStepSchema, { firstName: 'A', lastName: 'B' })).toEqual([
      'O nome precisa ter ao menos 2 caracteres.',
      'O sobrenome precisa ter ao menos 2 caracteres.',
    ]);
  });
});

describe('emailStepSchema', () => {
  it('valida formato do e-mail', async () => {
    expect(
      await messages(emailStepSchema, { email: 'abc', emailConfirm: 'abc' })
    ).toEqual(['Informe um e-mail válido.']);
  });

  it('aceita confirmação igual ignorando espaços e maiúsculas', async () => {
    expect(
      await messages(emailStepSchema, {
        email: 'Marina@Exemplo.com',
        emailConfirm: ' marina@exemplo.com ',
      })
    ).toEqual([]);
  });

  it('erro quando os e-mails não coincidem', async () => {
    expect(
      await messages(emailStepSchema, {
        email: 'a@b.com',
        emailConfirm: 'c@b.com',
      })
    ).toEqual(['Os e-mails não coincidem.']);
  });
});

describe('passwordStepSchema', () => {
  it('exige 8 caracteres', async () => {
    expect(
      await messages(passwordStepSchema, { password: '1234567', passwordConfirm: '1234567' })
    ).toEqual(['A senha precisa ter ao menos 8 caracteres.']);
  });

  it('erro "As senhas não coincidem."', async () => {
    expect(
      await messages(passwordStepSchema, { password: '12345678', passwordConfirm: '1234567x' })
    ).toEqual(['As senhas não coincidem.']);
  });

  it('campos vazios pedem preenchimento', async () => {
    const errors = await messages(passwordStepSchema, { password: '', passwordConfirm: '' });
    expect(errors).toContain('Crie uma senha.');
    expect(errors).toContain('Confirme sua senha.');
  });
});

describe('arePreviousStepsValid', () => {
  const base = {
    firstName: 'Marina',
    lastName: 'Souza',
    email: 'm@e.com',
    emailConfirm: 'm@e.com',
  };

  it('passo 1 sempre acessível', () => {
    expect(arePreviousStepsValid(1, {})).toBe(true);
  });

  it('passo 2 exige passo 1 válido', () => {
    expect(arePreviousStepsValid(2, { firstName: '', lastName: '' })).toBe(false);
    expect(arePreviousStepsValid(2, base)).toBe(true);
  });

  it('passo 3 exige passos 1 e 2 válidos', () => {
    expect(arePreviousStepsValid(3, { ...base, emailConfirm: '' })).toBe(false);
    expect(arePreviousStepsValid(3, base)).toBe(true);
  });
});
