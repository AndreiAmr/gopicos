import { gql } from '@apollo/client';

const getSearchPlaceQuery = gql`
  query getFowardGeocoding($search: String!) {
    getFowardGeocoding(search: $search) {
      name
      lat
      lng
      road
      district
      suburb
      city
      state
      boundingBox
    }
  }
`;

export { getSearchPlaceQuery };
