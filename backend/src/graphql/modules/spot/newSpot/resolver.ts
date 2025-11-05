import {
  newSpotController,
  NewSpotInput,
} from '../../../../controllers/spot/newSpot/newSpot.controller';

import { ContextType } from '../../../directives/authenticationDirective';

type CreateSpotResolverProps = {
  input: NewSpotInput;
};

export const newSpotResolver = {
  Mutation: {
    createSpot: async (
      _: any,
      { input }: CreateSpotResolverProps,
      { auth }: ContextType
    ) => {
      return newSpotController(input, auth);
    },
  },
};
