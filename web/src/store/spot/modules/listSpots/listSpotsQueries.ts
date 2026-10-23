import { gql } from '@apollo/client';

const getListSpotsQuery = gql`
  query getAllSpots($filter: SpotsFilter) {
    getAllSpots(filter: $filter) {
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
      ratingAverage
      reviewsCount
    }
  }
`;

export { getListSpotsQuery };
