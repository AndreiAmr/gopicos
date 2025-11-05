import { gql } from '@apollo/client';

const getListSpotsQuery = gql`
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

export { getListSpotsQuery };
