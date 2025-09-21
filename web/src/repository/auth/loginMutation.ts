import { gql } from '@apollo/client';

export type ILoginData = {
  login: {
    token: string;
    exp: number;
    createdAt: number;
    name: string;
    email: string;
    id: string;
  };
};

const loginMutation = gql`
  mutation loginMutation($prop: ILoginInput) {
    login(props: $prop) {
      token
      exp
      createdAt
      name
      email
      id
    }
  }
`;

export { loginMutation };
