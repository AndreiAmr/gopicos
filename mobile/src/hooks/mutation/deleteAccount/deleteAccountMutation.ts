import { gql, TypedDocumentNode } from '@apollo/client';

export type DeleteAccountVariables = {
  props: { password: string };
};

export type DeleteAccountResult = {
  deleteAccount: { message: string | null } | null;
};

export const deleteAccountMutation: TypedDocumentNode<
  DeleteAccountResult,
  DeleteAccountVariables
> = gql`
  mutation DeleteAccount($props: DeleteAccountInput!) {
    deleteAccount(props: $props) {
      message
    }
  }
`;
