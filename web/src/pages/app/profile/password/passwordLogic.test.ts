import { describe, expect, it } from 'vitest';

import { validatePasswordForm } from './passwordLogic';

const valid = {
  currentPassword: 'senhaAtual1',
  newPassword: 'novaSenha123',
  confirmPassword: 'novaSenha123',
};

describe('validatePasswordForm', () => {
  it('aceita dados válidos', () => {
    expect(validatePasswordForm(valid)).toEqual({});
  });

  it('exige os três campos', () => {
    expect(
      validatePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }),
    ).toEqual({
      currentPassword: 'Informe sua senha atual.',
      newPassword: 'Crie uma nova senha.',
      confirmPassword: 'Confirme a nova senha.',
    });
  });

  it('exige mínimo de 8 caracteres', () => {
    expect(
      validatePasswordForm({ ...valid, newPassword: 'curta', confirmPassword: 'curta' }).newPassword,
    ).toBe('A senha precisa ter ao menos 8 caracteres.');
  });

  it('rejeita nova senha igual à atual', () => {
    expect(
      validatePasswordForm({
        ...valid,
        newPassword: valid.currentPassword,
        confirmPassword: valid.currentPassword,
      }).newPassword,
    ).toBe('A nova senha precisa ser diferente da atual.');
  });

  it('rejeita confirmação diferente antes do envio', () => {
    expect(
      validatePasswordForm({ ...valid, confirmPassword: 'outraSenha1' }).confirmPassword,
    ).toBe('As senhas não coincidem.');
  });
});
