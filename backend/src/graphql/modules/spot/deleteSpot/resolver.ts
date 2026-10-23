import { deleteSpotController } from '../../../../controllers/spot/deleteSpot/deleteSpot.controller';
import { ContextType } from '../../../directives/authenticationDirective';

export const deleteSpotResolver = {
  Mutation: {
    deleteSpot: async (
      _: any,
      { id }: { id: string },
      { auth }: ContextType,
    ) => {
      // A identidade vem sempre do token; o service confere se é o autor.
      return deleteSpotController(id, auth!);
    },
  },
};
