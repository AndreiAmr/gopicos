import { gql, TypedDocumentNode } from '@apollo/client';

type LoginTokenResult = {
  token: string;
  exp: number;
  createdAt: number;
  name: string;
  email: string;
  id: string;
};

export type LoginMutationResult = {
  login: LoginTokenResult;
};

export type LoginMutationVariables = {
  props: {
    email: string;
    password: string;
  };
};

export const loginMutation: TypedDocumentNode<
  LoginMutationResult,
  LoginMutationVariables
> = gql`
  mutation LoginAuthentication($props: ILoginInput) {
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
