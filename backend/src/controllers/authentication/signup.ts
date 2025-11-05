import { User } from '../../../prisma/generated';
import { SignupModel } from '../../models/authentication/signupModel';
import { signUpService } from '../../services/authentication/signup/signupService';
import bcrypt from 'bcrypt';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const salts = process.env.BCRYPT_SALTS;

export const signupController = async (props: User) => {
  const { name, email, password } = props;

  if (!name || !email || !password) {
    throw new Error('Invalid credentials');
  }

  if (!emailRegex.test(email)) throw new Error('Email inválido');

  if (!salts) throw new Error('Missing Salts');

  const hashedPassword = await bcrypt.hash(password, Number(salts));

  await signUpService({ ...props, password: hashedPassword });

  return new SignupModel('Usuário criado com sucesso');
};
