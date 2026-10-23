import { gql, TypedDocumentNode } from '@apollo/client';

export type SignupMutationResult = {
  signup: { message: string | null } | null;
};

export type SignupMutationVariables = {
  props: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};

export const signupMutation: TypedDocumentNode<
  SignupMutationResult,
  SignupMutationVariables
> = gql`
  mutation Signup($props: SignupProp!) {
    signup(props: $props) {
      message
    }
  }
`;
