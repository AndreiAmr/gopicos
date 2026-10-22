import { listSpotsResolvers } from './listSpots/resolver';
import { newSpotResolver } from './newSpot/resolver';
import { spotReviewResolver } from './spotReview/resolver';

export const spotResolvers = {
  Query: {
    ...listSpotsResolvers.Query,
  },

  Mutation: {
    ...newSpotResolver.Mutation,
    ...spotReviewResolver.Mutation,
  },
};
