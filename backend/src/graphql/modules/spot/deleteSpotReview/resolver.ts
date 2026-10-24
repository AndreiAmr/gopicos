import { deleteSpotReviewController } from '../../../../controllers/spot/deleteSpotReview/deleteSpotReview.controller';
import { ContextType } from '../../../directives/authenticationDirective';

export const deleteSpotReviewResolver = {
  Mutation: {
    deleteSpotReview: async (
      _: unknown,
      { id }: { id: string },
      { auth }: ContextType,
    ) =>
      // A identidade vem sempre do token; o service confere se é o autor.
      deleteSpotReviewController(id, auth!.id),
  },
};
