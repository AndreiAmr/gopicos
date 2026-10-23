import { Prisma, User } from '../../../prisma/generated';
import { userRepository } from '../../../database/repositories/User';
import { AppError } from '../../../utils/AppError';
import { SignupDTO } from './signupDTO';

export type SignupServiceProps = Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>;

const emailAlreadyExists = () =>
  new AppError({
    type: 'EMAIL_ALREADY_EXISTS',
    message: 'Este e-mail já tem cadastro.',
    statusCode: 409,
    field: 'email',
  });

export const signUpService = async (
  prop: SignupServiceProps,
): Promise<SignupDTO> => {
  if (await userRepository.find({ email: prop.email })) {
    throw emailAlreadyExists();
  }

  try {
    const userCreated = await userRepository.create(prop as User);

    return new SignupDTO(userCreated);
  } catch (err) {
    // corrida entre dois cadastros simultâneos: a constraint única do banco decide
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      throw emailAlreadyExists();
    }

    throw err;
  }
};
