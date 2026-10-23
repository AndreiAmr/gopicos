import { gql } from '@apollo/client';

const signInMutation = gql`
  mutation makeLogin($props: ILoginInput) {
    login(props: $props) {
      token
      exp
      name
      email
      id
      reactivated
    }
  }
`;

export { signInMutation };
