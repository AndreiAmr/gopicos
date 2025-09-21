import { ContextProps } from '../../../..';
import {
  loginController,
  LoginControllerProps,
} from '../../../../controllers/authentication/login';

export const loginResolvers = {
  Mutation: {
    login: (_: any, { props }: { props: LoginControllerProps }) => {
      return loginController(props);
    },
  },
};
