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

  return data.getAllSpots;
};

export const listSpotsRepository = {
  getListSpots,
};
