import { apolloClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

const query = gql`
  query GetSpotById($id: String!) {
    getSpotById(id: $id) {
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
      openingHours
      markingType
      reviews {
        title
        description
        author {
          name
        }
      }
    }
  }
`;

type ISpotDetailsResponse = {
  getSpotById: SpotProps;
};

export const fetchSpotDetails = async (id: string) => {
  const res = await fetch(
    `http://localhost:3000/api/spot/spotDetails?id=${id}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  // const { data } = await apolloClient.query<ISpotDetailsResponse>({
  //   query,
  //   variables: { id },
  //   fetchPolicy: 'network-only',
  // });

  // return data.getSpotById;
};
