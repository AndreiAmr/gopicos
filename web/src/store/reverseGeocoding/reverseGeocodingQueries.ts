import { gql } from '@apollo/client';

const getReverseGeocodingQuery = gql`
  query ReverseGeocoding($input: GeoProps) {
    getReverseGeocoding(input: $input) {
      road
      quarter
      suburb
    }
  }
`;

export { getReverseGeocodingQuery };
