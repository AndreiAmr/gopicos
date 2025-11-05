import { IListSpots } from './listSpotsTypes';
import { getListSpotsQuery } from './listSpotsQueries';
import { apolloClient } from '@/config/apollo-client';

const getListSpots = async (): Promise<IListSpots | null> => {
  const { data } = await apolloClient.query<{
    getAllSpots: IListSpots;
  }>({
    fetchPolicy: 'no-cache',
    query: getListSpotsQuery,
  });
  console.log('🚀 ~ getListSpots ~ data:', data);

  return data.getAllSpots;
};

export const listSpotsRepository = {
  getListSpots,
};
