import { signupController } from '../../../../controllers/authentication/signup';
import { SignupInput } from '../../../../controllers/authentication/signupValidation';

export const signupResolvers = {
  Mutation: {
    signup: (_: unknown, args: { props: SignupInput }) =>
      signupController(args.props),
  },
};
