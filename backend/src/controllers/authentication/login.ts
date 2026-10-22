import { loginService } from '../../services/authentication/login/loginService';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import { userRepository } from '../../database/repositories/User';
import { AppError } from '../../utils/AppError';

// Hash descartável para manter o custo do bcrypt quando o e-mail não existe
const DUMMY_HASH = bcrypt.hashSync('gopicos-dummy', 10);

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

    // Mesma resposta para e-mail inexistente e senha errada (não revela qual falhou)
    const passwordsMatch = await bcrypt.compare(
      prop.password,
      user?.password ?? DUMMY_HASH,
    );

    if (!user || !passwordsMatch) {
      throw new AppError({
        type: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos',
        statusCode: 401,
      });
    }

    // Conta desativada com senha correta é reativada no login (D14)
    const reactivated = user.deactivatedAt !== null;
    if (reactivated) await userRepository.reactivate({ id: user.id });

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
      reactivated,
    };

    return loginData;
  } catch (err) {
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
