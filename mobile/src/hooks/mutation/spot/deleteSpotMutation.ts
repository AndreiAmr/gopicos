import { gql, TypedDocumentNode } from '@apollo/client';

export type DeleteSpotVariables = { id: string };

export type DeleteSpotResult = { deleteSpot: { id: string } | null };

export const deleteSpotMutation: TypedDocumentNode<
  DeleteSpotResult,
  DeleteSpotVariables
> = gql`
  mutation DeleteSpot($id: String!) {
    deleteSpot(id: $id) {
      id
    }
  }
`;
