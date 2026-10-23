import { gql, TypedDocumentNode } from '@apollo/client';
import { SpotSummary } from '../../../domain/spot/spot';
import type { SpotsQueryFilter } from '../../../domain/spot/filters';

export type SpotsQueryResult = {
  getAllSpots: SpotSummary[] | null;
};

export type SpotsQueryVariables = { filter?: SpotsQueryFilter | null };

export const spotsQuery: TypedDocumentNode<
  SpotsQueryResult,
  SpotsQueryVariables
> = gql`
  query GetAllSpots($filter: SpotsFilter) {
    getAllSpots(filter: $filter) {
      id
      name
      modality
      coordinates
      ratingAverage
      reviewsCount
    }
  }
`;
