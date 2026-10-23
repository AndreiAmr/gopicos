import { gql, TypedDocumentNode } from '@apollo/client';
import type { ReviewsPage } from '../../../domain/spot/reviews';

export type SpotReviewsResult = { getSpotReviews: ReviewsPage };
export type SpotReviewsVariables = {
  spotId: string;
  first?: number;
  after?: string | null;
};

export const spotReviewsQuery: TypedDocumentNode<
  SpotReviewsResult,
  SpotReviewsVariables
> = gql`
  query GetSpotReviews($spotId: String!, $first: Int, $after: String) {
    getSpotReviews(spotId: $spotId, first: $first, after: $after) {
      items {
        id
        rating
        description
        createdAt
        isMine
        author {
          id
          displayName
        }
      }
      nextCursor
      hasMore
      totalCount
      ratingAverage
      myReview {
        id
        rating
        description
        createdAt
        isMine
        author {
          id
          displayName
        }
      }
    }
  }
`;
