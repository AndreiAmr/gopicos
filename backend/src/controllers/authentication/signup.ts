import bcrypt from 'bcrypt';
import { SignupModel } from '../../models/authentication/signupModel';
import { signUpService } from '../../services/authentication/signup/signupService';
import { AppError } from '../../utils/AppError';
import { normalizeEmail } from '../../utils/email';
import { SignupInput, validateSignupInput } from './signupValidation';

export const signupController = async (props: SignupInput) => {
  validateSignupInput(props);

  const salts = Number(process.env.BCRYPT_SALTS);

  if (!salts) {
    throw new AppError({
      type: 'INTERNAL_ERROR',
      message: 'Erro ao efetuar cadastro',
      statusCode: 500,
    });
  }

  const hashedPassword = await bcrypt.hash(props.password, salts);

  await signUpService({
    firstName: props.firstName.trim(),
    lastName: props.lastName.trim(),
    email: normalizeEmail(props.email),
    password: hashedPassword,
  });

  return new SignupModel('Usuário criado com sucesso');
};
