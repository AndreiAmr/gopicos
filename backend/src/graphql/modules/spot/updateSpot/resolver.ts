import {
  updateSpotController,
  UpdateSpotInput,
} from '../../../../controllers/spot/updateSpot/updateSpot.controller';
import { ContextType } from '../../../directives/authenticationDirective';

export const updateSpotResolver = {
  Mutation: {
    updateSpot: async (
      _: any,
      { id, input }: { id: string; input: UpdateSpotInput },
      { auth }: ContextType,
    ) => {
      // A identidade vem sempre do token; o service confere se é o autor.
      return updateSpotController(id, input, auth!);
    },
  },
};
