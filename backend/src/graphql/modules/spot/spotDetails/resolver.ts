import { spotDetailsController } from '../../../../controllers/spot/spotDetails/spotDetails.controller';
import { ContextType } from '../../../directives/authenticationDirective';

import { fullName } from '../../../../utils/fullName';

type SpotDetailsResolverProps = {
  id: string;
};

export const spotDetailsResolver = {
  Query: {
    getSpotById: async (
      _: any,
      { id }: SpotDetailsResolverProps,
      { auth }: ContextType,
    ) => {
      return spotDetailsController(id, auth!.id);
    },
  },
  SpotAuthor: {
    name: (author: { firstName: string; lastName: string }) => fullName(author),
  },
};
