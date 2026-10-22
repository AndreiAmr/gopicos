import bcrypt from 'bcrypt';
import { SignupModel } from '../../models/authentication/signupModel';
import {
  requestPasswordResetService,
  resetPasswordService,
} from '../../services/authentication/passwordReset/passwordResetService';
import { AppError } from '../../utils/AppError';
import { PASSWORD_MIN_LENGTH } from './signupValidation';

export type ResetPasswordInput = {
  email: string;
  code: string;
  newPassword: string;
};

/** Resposta idêntica exista ou não a conta (não revela e-mails cadastrados). */
export const REQUEST_RESET_MESSAGE =
  'Se o e-mail estiver cadastrado, enviamos um código de recuperação.';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invalid = (field: string, message: string) =>
  new AppError({ type: 'VALIDATION_ERROR', message, statusCode: 400, field });

export const requestPasswordResetController = async (email: string) => {
  if (!email?.trim()) {
    throw invalid('email', 'Informe seu e-mail.');
  }

  if (!emailRegex.test(email.trim())) {
    throw invalid('email', 'Informe um e-mail válido.');
  }

  await requestPasswordResetService(email);

  return new SignupModel(REQUEST_RESET_MESSAGE);
};

export const resetPasswordController = async (props: ResetPasswordInput) => {
  if (!props.newPassword) {
    throw invalid('newPassword', 'Crie uma nova senha.');
  }

  if (props.newPassword.length < PASSWORD_MIN_LENGTH) {
    throw invalid(
      'newPassword',
      `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.`,
    );
  }

  const salts = Number(process.env.BCRYPT_SALTS);

  if (!salts) {
    throw new AppError({
      type: 'INTERNAL_ERROR',
      message: 'Erro ao redefinir a senha',
      statusCode: 500,
    });
  }

  const hashedPassword = await bcrypt.hash(props.newPassword, salts);

  await resetPasswordService({
    email: props.email ?? '',
    code: (props.code ?? '').trim(),
    hashedPassword,
  });

  return new SignupModel('Senha redefinida com sucesso');
};
