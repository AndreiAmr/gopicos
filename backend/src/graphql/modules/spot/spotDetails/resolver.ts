import { spotDetailsController } from '../../../../controllers/spot/spotDetails/spotDetails.controller';
import { ContextType } from '../../../directives/authenticationDirective';

import { displayName } from '../../../../utils/displayName';

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
  // Autor em contexto público: só id e "Nome S." (D36), nunca o sobrenome.
  SpotAuthor: {
    displayName: (author: {
      firstName: string;
      lastName: string;
      deactivatedAt: Date | null;
    }) => displayName(author),
  },
};
