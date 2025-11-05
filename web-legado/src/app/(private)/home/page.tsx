import { getServerApolloClient } from '@/lib/apollo-server-client';

import HomeTemplate from '@/templates/App/HomeTemplate';
import { gql } from '@apollo/client';

export default async function Home() {
  const query = gql`
    query getAllSpots {
      getAllSpots {
        id
        name
        description
        images
        coordinates
        isPaid
        coordinates
        hasCoverage
        alwaysOpen
        modality
        markingType
      }
    }
  `;

  const client = await getServerApolloClient();
  const { data } = await client.query({ query });

  return <HomeTemplate spots={data.getAllSpots || []} />;
}
