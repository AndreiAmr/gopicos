import { gql } from '@apollo/client';

export type DeleteSpotResult = { deleteSpot: { id: string } };
export type DeleteSpotVariables = { id: string };

export const DELETE_SPOT_MUTATION = gql`
  mutation DeleteSpot($id: String!) {
    deleteSpot(id: $id) {
      id
    }
  }
`;
