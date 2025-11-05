import { User } from '../../../../prisma/generated';
import { userRepository } from '../../../database/repositories/User';
import { SignupDTO } from './signupDto';

export const signUpService = async (prop: User): Promise<User> => {
  const userCreated = await userRepository.create(prop);

  return new SignupDTO(userCreated);
};
