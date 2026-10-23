export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_STRINGS = {
  title: 'Alterar senha',
  intro: 'Escolha uma senha nova com pelo menos 8 caracteres.',
  current: 'Senha atual',
  next: 'Nova senha',
  nextHint: 'Mínimo de 8 caracteres.',
  confirm: 'Confirmar nova senha',
  submit: 'Alterar senha',
} as const;

export type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type PasswordFormErrors = Partial<Record<keyof PasswordFormValues, string>>;

/** Regras e mensagens da spec 6.2. */
export const validatePasswordForm = (
  values: PasswordFormValues,
): PasswordFormErrors => {
  const errors: PasswordFormErrors = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Informe sua senha atual.';
  }

  if (!values.newPassword) {
    errors.newPassword = 'Crie uma nova senha.';
  } else if (values.newPassword.length < PASSWORD_MIN_LENGTH) {
    errors.newPassword = `A senha precisa ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  } else if (values.newPassword === values.currentPassword) {
    errors.newPassword = 'A nova senha precisa ser diferente da atual.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirme a nova senha.';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
};
