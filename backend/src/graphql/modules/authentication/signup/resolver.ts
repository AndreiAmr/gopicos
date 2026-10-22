import { User } from '../../../../prisma/generated';
import { signupController } from '../../../../controllers/authentication/signup';

export const signupResolvers = {
  Mutation: {
    signup: (_: any, props: { props: User }) => {
      return signupController(props.props);
    },
  },
};
