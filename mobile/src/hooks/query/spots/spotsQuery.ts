import { gql, TypedDocumentNode } from '@apollo/client';
import { SpotSummary } from '../../../domain/spot/spot';

export type SpotsQueryResult = {
  getAllSpots: SpotSummary[] | null;
};

export const spotsQuery: TypedDocumentNode<SpotsQueryResult> = gql`
  query GetAllSpots {
    getAllSpots {
      id
      name
      modality
      coordinates
      ratingAverage
      reviewsCount
    }
  }
`;
