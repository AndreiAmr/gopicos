import { gql } from '@apollo/client';

import type { ReviewsPage } from '@/domain/spot/reviews';

export type SpotReviewsResult = { getSpotReviews: ReviewsPage };
export type SpotReviewsVariables = {
  spotId: string;
  first?: number;
  after?: string | null;
};

const REVIEW_FIELDS = `
  id
  rating
  description
  createdAt
  isMine
  author {
    id
    displayName
  }
`;

export const SPOT_REVIEWS_QUERY = gql`
  query GetSpotReviews($spotId: String!, $first: Int, $after: String) {
    getSpotReviews(spotId: $spotId, first: $first, after: $after) {
      items {
        ${REVIEW_FIELDS}
      }
      nextCursor
      hasMore
      totalCount
      ratingAverage
      myReview {
        ${REVIEW_FIELDS}
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateSpotReview($data: SpotReview!) {
    createSpotReview(data: $data) {
      rating
      description
    }
  }
`;
