import { gql } from '@apollo/client';

export const getAllSpotsQuery = gql`
  query getAllSpots {
    getAllSpots {
      id
      name
      description
      modality
      isPaid
      alwaysOpen
      hasCoverage
      images
      equipmentRequired
      entryAmount
      coordinates
      markingType
    }
  }
`;
