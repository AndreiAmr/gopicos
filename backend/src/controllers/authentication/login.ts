import { LoginModel } from '../../models/authentication/loginModel';
import { loginService } from '../../services/authentication/login/loginService';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';

export type LoginControllerProps = {
  email: string;
  password: string;
};

export const loginController = async (prop: LoginControllerProps) => {
  try {
    const { email, password } = prop;

    if (!email || !password) {
      throw new Error('Invalid credentials');
    }

    const user = await loginService(prop);

    const passwordsMatch = await bcrypt.compare(prop.password, user.password);

    if (!passwordsMatch) {
      throw new Error('Senha incorreta');
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

    return new LoginModel(loginData);
  } catch (err) {
    console.log(err);
  }
};
