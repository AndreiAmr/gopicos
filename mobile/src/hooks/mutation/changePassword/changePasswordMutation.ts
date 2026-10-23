import { gql, TypedDocumentNode } from '@apollo/client';

export type ChangePasswordVariables = {
  props: { currentPassword: string; newPassword: string };
};

export type ChangePasswordResult = {
  changePassword: { message: string | null } | null;
};

export const changePasswordMutation: TypedDocumentNode<
  ChangePasswordResult,
  ChangePasswordVariables
> = gql`
  mutation ChangePassword($props: ChangePasswordInput!) {
    changePassword(props: $props) {
      message
    }
  }
`;
