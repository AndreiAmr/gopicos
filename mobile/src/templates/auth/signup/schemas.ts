import * as yup from 'yup';

export const MIN_PASSWORD_LENGTH = 8;

export const normalizeEmail = (value?: string) =>
  (value ?? '').trim().toLowerCase();

export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
};

export type SignupStep = 1 | 2 | 3;

export const STEP_FIELDS: Record<SignupStep, (keyof SignupFormData)[]> = {
  1: ['firstName', 'lastName'],
  2: ['email', 'confirmEmail'],
  3: ['password', 'confirmPassword'],
};

export const signupSchema: yup.ObjectSchema<SignupFormData> = yup.object({
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
  email: yup
    .string()
    .trim()
    .required('Informe seu e-mail.')
    .email('Informe um e-mail válido.'),
  confirmEmail: yup
    .string()
    .required('Confirme seu e-mail.')
    .test(
      'emails-match',
      'Os e-mails não coincidem.',
      (value, ctx) =>
        normalizeEmail(value) === normalizeEmail(ctx.parent.email),
    ),
  password: yup
    .string()
    .required('Crie uma senha.')
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    ),
  confirmPassword: yup
    .string()
    .required('Confirme sua senha.')
    .test(
      'passwords-match',
      'As senhas não coincidem.',
      (value, ctx) => value === ctx.parent.password,
    ),
});
