import { gql } from '@apollo/client';

const signUpMutation = gql`
  mutation makeSignUp($props: SignupProp!) {
    signup(props: $props) {
      message
    }
  }
`;

export { signUpMutation };
