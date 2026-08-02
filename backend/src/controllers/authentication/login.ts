import { loginService } from '../../services/authentication/login/loginService';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';

export type LoginControllerProps = {
  email: string;
  password: string;
};

export const loginController = async (prop: LoginControllerProps) => {
  try {
    const { email, password } = prop;

    if (!email || !password) {
      throw new AppError({
        type: 'VALIDATION_ERROR',
        message: 'Email e senha são obrigatórios',
        statusCode: 400,
      });
    }

    const user = await loginService(prop);

    const passwordsMatch = await bcrypt.compare(prop.password, user.password);
    console.log('🚀 ~ loginController ~ passwordsMatch:', passwordsMatch);

    if (!passwordsMatch) {
      throw new AppError({
        type: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos',
        statusCode: 401,
      });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const tokenData = generateToken(tokenPayload);

    const loginData = {
      ...tokenData,
      name: user.name,
      email: user.email,
      id: user.id,
    };

    console.log('🚀 ~ loginController ~ mixpanel disparado com sucesso!');

    const loginDataWithDelay = await new Promise<typeof loginData>(
      (resolve) => {
        setTimeout(() => {
          resolve(loginData);
        }, 3000);
      },
    );

    return loginDataWithDelay;
  } catch (err) {
    console.log(err);

    if (err instanceof Error) {
      throw err;
    }

    throw new AppError({
      type: 'INTERNAL_ERROR',
      message: 'Erro ao efetuar login',
      statusCode: 500,
    });
  }
};
