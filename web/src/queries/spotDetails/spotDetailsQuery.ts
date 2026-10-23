import { gql } from '@apollo/client';

import type { SpotDetails } from '@/domain/spot/details';

export type SpotDetailsQueryResult = { getSpotById: SpotDetails | null };
export type SpotDetailsQueryVariables = { id: string };

export const SPOT_DETAILS_QUERY = gql`
  query GetSpotById($id: String!) {
    getSpotById(id: $id) {
      id
      name
      description
      modality
      isPaid
      entryAmount
      alwaysOpen
      openingHours
      hasCoverage
      equipmentRequired
      images
      coordinates
      ratingAverage
      reviewsCount
      isOwner
      author {
        id
        displayName
      }
    }
  }
`;
