import { deleteSpotResolver } from './deleteSpot/resolver';
import { listSpotsResolvers } from './listSpots/resolver';
import { newSpotResolver } from './newSpot/resolver';
import { updateSpotResolver } from './updateSpot/resolver';
import { spotReviewResolver } from './spotReview/resolver';
import { updateSpotReviewResolver } from './updateSpotReview/resolver';
import { deleteSpotReviewResolver } from './deleteSpotReview/resolver';

export const spotResolvers = {
  Query: {
    ...listSpotsResolvers.Query,
  },

  Mutation: {
    ...newSpotResolver.Mutation,
    ...updateSpotResolver.Mutation,
    ...spotReviewResolver.Mutation,
    ...deleteSpotResolver.Mutation,
    ...updateSpotReviewResolver.Mutation,
    ...deleteSpotReviewResolver.Mutation,
  },
};
