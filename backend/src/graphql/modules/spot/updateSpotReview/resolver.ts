import { updateSpotReviewController } from '../../../../controllers/spot/updateSpotReview/updateSpotReview.controller';
import { ContextType } from '../../../directives/authenticationDirective';

type UpdateSpotReviewArgs = {
  id: string;
  data: { rating: number; description?: string | null };
};

export const updateSpotReviewResolver = {
  Mutation: {
    updateSpotReview: async (
      _: unknown,
      { id, data }: UpdateSpotReviewArgs,
      { auth }: ContextType,
    ) =>
      // A identidade vem sempre do token; o service confere se é o autor.
      updateSpotReviewController({
        id,
        userId: auth!.id,
        rating: data.rating,
        description: data.description,
      }),
  },
};
