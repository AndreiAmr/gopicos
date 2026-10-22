import { requestPasswordResetController } from '../../../../controllers/authentication/passwordReset';

export const requestPasswordResetResolvers = {
  Mutation: {
    requestPasswordReset: (_: unknown, args: { email: string }) =>
      requestPasswordResetController(args.email),
  },
};
