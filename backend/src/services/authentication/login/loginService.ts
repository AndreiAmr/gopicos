import { userRepository } from '../../../database/repositories/User';
import { LoginDTO } from './loginDTO';

type LoginServiceProps = {
  email: string;
  password: string;
};

export const loginService = async (props: LoginServiceProps) => {
  const user = await userRepository.find(props);
  console.log('🚀 ~ loginService called');

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return new LoginDTO(user);
};
