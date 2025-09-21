import {
  newSpotController,
  NewSpotInput,
} from '../../../../controllers/spot/newSpot/newSpot.controller';
import { IAuthentication } from '../../../../models/authentication/authenticationModel';
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

      // for (const image of input.images) {
      //   await cloudinaryModel.uploadImage(image);
      // }

      // return {
      //   name: 'test',
      // };
    },
  },
};
