import { userRepository } from '../../../database/repositories/User';
import { LoginDTO } from './loginDTO';
import { AppError } from '../../../utils/AppError';

type LoginServiceProps = {
  email: string;
  password: string;
};

export const loginService = async (props: LoginServiceProps) => {
  console.log('🚀 ~ loginService ~ props:', props);
  const user = await userRepository.find(props);

  if (!user) {
    throw new AppError({
      type: 'USER_NOT_FOUND',
      message: 'Usuário não encontrado',
      statusCode: 404,
    });
  }

  return new LoginDTO(user);
};
