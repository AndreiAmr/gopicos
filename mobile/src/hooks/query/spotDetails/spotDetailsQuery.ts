import { gql, TypedDocumentNode } from '@apollo/client';
import { SpotDetails } from '../../../domain/spot/details';

export type SpotDetailsQueryResult = {
  getSpotById: SpotDetails | null;
};

export type SpotDetailsQueryVariables = { id: string };

export const spotDetailsQuery: TypedDocumentNode<
  SpotDetailsQueryResult,
  SpotDetailsQueryVariables
> = gql`
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
