import { AppError } from '../../utils/AppError';

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const PASSWORD_MIN_LENGTH = 8;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalid = (field: string, message: string) =>
  new AppError({ type: 'VALIDATION_ERROR', message, statusCode: 400, field });

/**
 * Valida o input do cadastro e lança VALIDATION_ERROR com `extensions.field`
 * no primeiro campo inválido (ordem: firstName, lastName, email, password).
 * Para novas regras (ex.: aceite de termos, GP-099) basta adicionar um passo aqui.
 */
export const validateSignupInput = (input: Partial<SignupInput>): void => {
  if (!input.firstName?.trim()) {
    throw invalid('firstName', 'Informe seu nome.');
  }

  if (!input.lastName?.trim()) {
    throw invalid('lastName', 'Informe seu sobrenome.');
  }

  if (!input.email?.trim()) {
    throw invalid('email', 'Informe seu e-mail.');
  }

  if (!emailRegex.test(input.email.trim())) {
    throw invalid('email', 'Informe um e-mail válido.');
  }

  if (!input.password) {
    throw invalid('password', 'Informe sua senha.');
  }

  if (input.password.length < PASSWORD_MIN_LENGTH) {
    throw invalid(
      'password',
      `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.`,
    );
  }
};
