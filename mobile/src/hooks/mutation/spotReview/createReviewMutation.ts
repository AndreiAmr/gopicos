import { gql, TypedDocumentNode } from '@apollo/client';

export type CreateReviewVariables = {
  data: { spotId: string; rating: number; description?: string | null };
};

export type CreateReviewResult = {
  createSpotReview: { rating: number | null; description: string | null } | null;
};

export const createReviewMutation: TypedDocumentNode<
  CreateReviewResult,
  CreateReviewVariables
> = gql`
  mutation CreateSpotReview($data: SpotReview!) {
    createSpotReview(data: $data) {
      rating
      description
    }
  }
`;
