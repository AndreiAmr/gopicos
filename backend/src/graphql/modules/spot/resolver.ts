import { listSpotsResolvers } from './listSpots/resolver';
import { newSpotResolver } from './newSpot/resolver';

export const spotResolvers = {
  Query: {
    ...listSpotsResolvers.Query,
  },

  Mutation: {
    ...newSpotResolver.Mutation,
  },
};
