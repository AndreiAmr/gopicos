import bcrypt from 'bcrypt';
import { SignupModel } from '../../models/authentication/signupModel';
import { userRepository } from '../../database/repositories/User';
import { AppError } from '../../utils/AppError';
import { PASSWORD_MIN_LENGTH } from '../authentication/signupValidation';
import { getProfileService } from '../../services/user/getProfile.service';

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

const invalid = (field: string, message: string) =>
  new AppError({ type: 'VALIDATION_ERROR', message, statusCode: 400, field });

/**
 * Troca a senha do usuário do token. Exige a senha atual. Não invalida tokens
 * (a sessão atual continua válida, D33).
 */
export const changePasswordController = async (
  userId: string,
  props: ChangePasswordInput,
) => {
  if (!props.currentPassword) {
    throw invalid('currentPassword', 'Informe sua senha atual.');
  }

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
      message: 'Erro ao alterar a senha',
      statusCode: 500,
    });
  }

  const user = await getProfileService(userId);

  const matches = await bcrypt.compare(props.currentPassword, user.password);

  if (!matches) {
    throw new AppError({
      type: 'INVALID_CREDENTIALS',
      message: 'Senha atual incorreta.',
      statusCode: 401,
      field: 'currentPassword',
    });
  }

  if (props.newPassword === props.currentPassword) {
    throw invalid('newPassword', 'A nova senha precisa ser diferente da atual.');
  }

  const password = await bcrypt.hash(props.newPassword, salts);
  await userRepository.updateById(userId, { password });

  return new SignupModel('Senha alterada com sucesso.');
};
