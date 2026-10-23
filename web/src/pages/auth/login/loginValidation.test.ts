import { describe, expect, it } from 'vitest';

import { validateLogin } from './loginValidation';

describe('validateLogin', () => {
  it('exige e-mail e senha', () => {
    expect(validateLogin('', '')).toEqual({
      email: 'Informe seu e-mail.',
      password: 'Informe sua senha.',
    });
  });

  it('rejeita e-mail malformado', () => {
    expect(validateLogin('abc', 'x').email).toBe('Informe um e-mail válido.');
  });

  it('aceita e-mail com espaços nas pontas e não impõe tamanho de senha', () => {
    expect(validateLogin('  a@b.com ', '1')).toEqual({});
  });
});
