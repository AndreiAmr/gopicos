import type { SpotsQueryFilter } from '@/domain/spot/filters';
import { IListSpots } from './listSpotsTypes';
import { getListSpotsQuery } from './listSpotsQueries';
import { apolloClient } from '@/config/apollo-client';

const getListSpots = async (
  filter?: SpotsQueryFilter | null,
): Promise<IListSpots | null> => {
  const { data } = await apolloClient.query<{
    getAllSpots: IListSpots;
  }>({
    fetchPolicy: 'no-cache',
    query: getListSpotsQuery,
    variables: filter ? { filter } : {},
  });

  return data.getAllSpots;
};

export const listSpotsRepository = {
  getListSpots,
};
