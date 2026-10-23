import { IReverseGeocoding } from './reverseGeocodingTypes';
import { getReverseGeocodingQuery } from './reverseGeocodingQueries';
import { apolloClient } from '@/config/apollo-client';

type Props = {
  lat: number;
  lng: number;
};
const getReverseGeocoding = async ({
  lat,
  lng,
}: Props): Promise<IReverseGeocoding | null> => {
  const { data } = await apolloClient.query<{
    getReverseGeocoding: IReverseGeocoding;
  }>({
    fetchPolicy: 'no-cache',
    query: getReverseGeocodingQuery,
    variables: {
      input: {
        lat,
        lng,
      },
    },
  });

  return data.getReverseGeocoding;
};

export const reverseGeocodingRepository = {
  getReverseGeocoding,
};
