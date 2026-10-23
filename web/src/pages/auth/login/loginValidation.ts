export type LoginFieldErrors = { email?: string; password?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validação do cliente: só vazio e formato do e-mail (spec de autenticação, 4.2). */
export const validateLogin = (
  email: string,
  password: string
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};
  const trimmed = email.trim();

  if (!trimmed) errors.email = 'Informe seu e-mail.';
  else if (!EMAIL_REGEX.test(trimmed)) errors.email = 'Informe um e-mail válido.';

  if (!password) errors.password = 'Informe sua senha.';

  return errors;
};
