import { spotReviewController } from '../../../../controllers/spot/spotReview/spotReview.controller';
import { ContextType } from '../../../directives/authenticationDirective';

type CreateSpotReviewResolverProps = {
  data: {
    spotId: string;
    rating: number;
    description?: string | null;
  };
};

export const spotReviewResolver = {
  Mutation: {
    createSpotReview: async (
      _: any,
      { data }: CreateSpotReviewResolverProps,
      { auth }: ContextType,
    ) => {
      // A identidade do autor vem sempre do token, nunca do input.
      return spotReviewController({
        spotId: data.spotId,
        rating: data.rating,
        description: data.description,
        authorId: auth!.id,
      });
    },
  },
};
