import * as yup from 'yup';

import { SignUpStep } from './signUpTypes';

export const PASSWORD_MIN_LENGTH = 8;

// Mesma regra do backend (signupValidation).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sameEmail = (a?: string, b?: string) =>
  (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase();

export const nameStepSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required('Informe seu nome.')
    .min(2, 'O nome precisa ter ao menos 2 caracteres.')
    .max(40),
  lastName: yup
    .string()
    .trim()
    .required('Informe seu sobrenome.')
    .min(2, 'O sobrenome precisa ter ao menos 2 caracteres.')
    .max(40),
});

export const emailStepSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Informe seu e-mail.')
    .matches(EMAIL_REGEX, 'Informe um e-mail válido.'),
  emailConfirm: yup
    .string()
    .trim()
    .required('Confirme seu e-mail.')
    .test('same-email', 'Os e-mails não coincidem.', function (value) {
      return sameEmail(value, this.parent.email);
    }),
});

export const passwordStepSchema = yup.object({
  password: yup
    .string()
    .required('Crie uma senha.')
    .min(
      PASSWORD_MIN_LENGTH,
      `A senha precisa ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`
    ),
  passwordConfirm: yup
    .string()
    .required('Confirme sua senha.')
    .test('same-password', 'As senhas não coincidem.', function (value) {
      return value === this.parent.password;
    }),
});

export const stepSchemas = {
  1: nameStepSchema,
  2: emailStepSchema,
  3: passwordStepSchema,
} as const;

/** Passos anteriores a `step` com dados validos (guarda de acesso direto). */
export const arePreviousStepsValid = (
  step: SignUpStep,
  values: object
): boolean => {
  if (step >= 2 && !nameStepSchema.isValidSync(values)) return false;
  if (step >= 3 && !emailStepSchema.isValidSync(values)) return false;
  return true;
};
