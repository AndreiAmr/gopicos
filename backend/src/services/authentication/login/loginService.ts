import { userRepository } from '../../../database/repositories/User';
import { LoginDTO } from './loginDTO';

type LoginServiceProps = {
  email: string;
  password: string;
};

export const loginService = async (props: LoginServiceProps) => {
  const user = await userRepository.find(props);

  return user ? new LoginDTO(user) : null;
};
