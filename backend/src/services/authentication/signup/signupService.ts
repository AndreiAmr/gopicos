import { User } from '@prisma/client';
import { userRepository } from '../../../database/repositories/User';
import { SignupDTO } from './signupDTO';

export const signUpService = async (prop: User): Promise<User> => {
  const userCreated = await userRepository.create(prop);

  return new SignupDTO(userCreated);
};
