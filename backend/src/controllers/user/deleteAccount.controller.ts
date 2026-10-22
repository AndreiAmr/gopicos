import bcrypt from 'bcrypt';
import { SignupModel } from '../../models/authentication/signupModel';
import { userRepository } from '../../database/repositories/User';
import { AppError } from '../../utils/AppError';
import { getProfileService } from '../../services/user/getProfile.service';

export type DeleteAccountInput = {
  password: string;
};

/**
 * "Excluir conta" = desativar (D4): exige a senha, marca deactivatedAt e não
 * apaga nenhum registro. Entrar de novo reativa a conta (D14).
 */
export const deleteAccountController = async (
  userId: string,
  props: DeleteAccountInput,
) => {
  if (!props.password) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'Informe sua senha para continuar.',
      statusCode: 400,
      field: 'password',
    });
  }

  const user = await getProfileService(userId);

  if (!(await bcrypt.compare(props.password, user.password))) {
    throw new AppError({
      type: 'INVALID_CREDENTIALS',
      message: 'Senha incorreta.',
      statusCode: 401,
      field: 'password',
    });
  }

  await userRepository.deactivate({ id: userId });

  return new SignupModel('Conta desativada com sucesso.');
};
