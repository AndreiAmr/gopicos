import { ContextType } from '../../../context';
import {
  DeleteAccountInput,
  deleteAccountController,
} from '../../../../controllers/user/deleteAccount.controller';

export const deleteAccountResolvers = {
  Mutation: {
    deleteAccount: (
      _: unknown,
      args: { props: DeleteAccountInput },
      context: ContextType,
    ) => deleteAccountController(context.auth.id, args.props),
  },
};
