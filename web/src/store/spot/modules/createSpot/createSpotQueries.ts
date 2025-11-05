import { gql } from '@apollo/client';

const createSpotMutation = gql`
  mutation CreateSpot($input: NewSpotInput!) {
    createSpot(input: $input) {
      name
    }
  }
`;

export { createSpotMutation };
