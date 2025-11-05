import { User } from '../../../../../prisma/generated';
import { signupController } from '../../../../controllers/authentication/signup';

export const signupResolvers = {
  Mutation: {
    signup: (_: any, props: { props: User }) => {
      console.log('🚀 ~ props:', props);
      return signupController(props.props);
    },
  },
};
