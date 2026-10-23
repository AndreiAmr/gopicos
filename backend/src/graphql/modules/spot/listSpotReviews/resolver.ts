import { listSpotReviewsController } from '../../../../controllers/spot/listSpotReviews/listSpotReviews.controller';
import { ContextType } from '../../../directives/authenticationDirective';

type ListSpotReviewsArgs = {
  spotId: string;
  first?: number | null;
  after?: string | null;
};

export const listSpotReviewsResolver = {
  Query: {
    getSpotReviews: async (
      _: unknown,
      args: ListSpotReviewsArgs,
      { auth }: ContextType,
    ) => listSpotReviewsController({ ...args, userId: auth!.id }),
  },
};
