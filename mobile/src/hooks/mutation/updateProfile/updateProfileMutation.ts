import { gql, TypedDocumentNode } from '@apollo/client';

export type UpdateProfileVariables = {
  props: { firstName: string; lastName: string };
};

export type UpdateProfileResult = {
  updateProfile: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

// `id` faz o Apollo atualizar o `me` em cache (Profile:<id>) sem refetch.
export const updateProfileMutation: TypedDocumentNode<
  UpdateProfileResult,
  UpdateProfileVariables
> = gql`
  mutation UpdateProfile($props: UpdateProfileInput!) {
    updateProfile(props: $props) {
      id
      name
      firstName
      lastName
      email
    }
  }
`;
