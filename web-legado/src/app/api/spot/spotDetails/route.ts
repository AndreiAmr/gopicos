import { getServerApolloClient } from '@/lib/apollo-server-client';
import { gql } from '@apollo/client';
import { cookies } from 'next/headers';

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

export async function POST(req: Request) {
  const token = (await cookies()).get('token')?.value;
  console.log('🚀 ~ POST ~ token:', token);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const client = await getServerApolloClient();
  console.log('🚀 ~ POST ~ id:', id);

  const result = await client.query({
    query,
    variables: {
      id,
    },
  });

  console.log('🚀 ~ POST ~ result:', result);
}
