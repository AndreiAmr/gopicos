import { gql } from '@apollo/client';

const signInMutation = gql`
  mutation makeLogin($props: ILoginInput) {
    login(props: $props) {
      token
      exp
      createdAt
      name
      email
      id
    }
  }
`;

export { signInMutation };
