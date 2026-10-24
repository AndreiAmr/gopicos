import { gql, TypedDocumentNode } from '@apollo/client';

export type DeleteReviewVariables = { id: string };

export type DeleteReviewResult = {
  deleteSpotReview: { id: string; spotId: string };
};

export const deleteReviewMutation: TypedDocumentNode<
  DeleteReviewResult,
  DeleteReviewVariables
> = gql`
  mutation DeleteSpotReview($id: String!) {
    deleteSpotReview(id: $id) {
      id
      spotId
    }
  }
`;
