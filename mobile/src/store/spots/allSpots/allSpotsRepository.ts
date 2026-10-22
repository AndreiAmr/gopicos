import { apolloClient } from '../../../config/apollo';
import { getAllSpotsQuery } from './allSpotsQueries';
import { Spot } from './allSpotsTypes';

export const getAllSpots = async () => {
  const result = await apolloClient.query<{ getAllSpots: Spot[] }>({
    query: getAllSpotsQuery,
  });

  return result?.data?.getAllSpots;
};

export const getAllSpotsRepository = {
  getAllSpots,
};
