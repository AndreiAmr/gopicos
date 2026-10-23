import { gql, TypedDocumentNode } from '@apollo/client';
import type { SpotSummary } from '../../../domain/spot/spot';

export type MySpotsResult = { mySpots: SpotSummary[] };

export const mySpotsQuery: TypedDocumentNode<MySpotsResult> = gql`
  query MySpots {
    mySpots {
      id
      name
      modality
      images
      coordinates
      ratingAverage
      reviewsCount
    }
  }
`;

export type MyReview = {
  id: string;
  rating: number;
  description: string | null;
  createdAt: string;
  spot: { id: string; name: string; modality: string };
};

export type MyReviewsResult = { myReviews: MyReview[] };

export const myReviewsQuery: TypedDocumentNode<MyReviewsResult> = gql`
  query MyReviews {
    myReviews {
      id
      rating
      description
      createdAt
      spot {
        id
        name
        modality
      }
    }
  }
`;
