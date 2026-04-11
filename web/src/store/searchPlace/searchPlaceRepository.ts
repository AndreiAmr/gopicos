import { apolloClient } from '@/config/apollo-client';
import { ISearchPlace } from './searchPlaceTypes';
import { getSearchPlaceQuery } from './searchPlaceQueries';

const getSearchPlace = async (
  search: string,
): Promise<ISearchPlace[] | null> => {
  const { data } = await apolloClient.query<{
    getFowardGeocoding: ISearchPlace[];
  }>({
    fetchPolicy: 'no-cache',
    query: getSearchPlaceQuery,
    variables: {
      search,
    },
  });

  return data.getFowardGeocoding;
};

export const searchPlaceRepository = {
  getSearchPlace,
};
