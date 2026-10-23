import {
  ResetPasswordInput,
  resetPasswordController,
} from '../../../../controllers/authentication/passwordReset';

export const resetPasswordResolvers = {
  Mutation: {
    resetPassword: (_: unknown, args: { props: ResetPasswordInput }) =>
      resetPasswordController(args.props),
  },
};
