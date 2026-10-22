import { ContextType } from '../../../context';
import { userActivityRepository } from '../../../../database/repositories/UserActivity';

export const myActivityResolvers = {
  Query: {
    mySpots: (_: unknown, __: unknown, context: ContextType) =>
      userActivityRepository.listSpotsByAuthor(context.auth.id),

    myReviews: async (_: unknown, __: unknown, context: ContextType) => {
      const reviews = await userActivityRepository.listReviewsByAuthor(
        context.auth.id,
      );

      return reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
      }));
    },
  },
};
