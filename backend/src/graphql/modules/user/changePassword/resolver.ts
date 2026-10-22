import { ContextType } from '../../../context';
import {
  ChangePasswordInput,
  changePasswordController,
} from '../../../../controllers/user/changePassword.controller';

export const changePasswordResolvers = {
  Mutation: {
    changePassword: (
      _: unknown,
      args: { props: ChangePasswordInput },
      context: ContextType,
    ) => changePasswordController(context.auth.id, args.props),
  },
};
