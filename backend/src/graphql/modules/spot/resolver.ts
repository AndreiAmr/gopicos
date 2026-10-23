import { listSpotsResolvers } from './listSpots/resolver';
import { newSpotResolver } from './newSpot/resolver';
import { updateSpotResolver } from './updateSpot/resolver';
import { spotReviewResolver } from './spotReview/resolver';

export const spotResolvers = {
  Query: {
    ...listSpotsResolvers.Query,
  },

  Mutation: {
    ...newSpotResolver.Mutation,
    ...updateSpotResolver.Mutation,
    ...spotReviewResolver.Mutation,
  },
};
