import { gql, TypedDocumentNode } from '@apollo/client';

export type UpdateReviewVariables = {
  id: string;
  data: { rating: number; description?: string | null };
};

export type UpdateReviewResult = {
  updateSpotReview: {
    id: string;
    rating: number | null;
    description: string | null;
  } | null;
};

export const updateReviewMutation: TypedDocumentNode<
  UpdateReviewResult,
  UpdateReviewVariables
> = gql`
  mutation UpdateSpotReview($id: String!, $data: UpdateSpotReview!) {
    updateSpotReview(id: $id, data: $data) {
      id
      rating
      description
    }
  }
`;
