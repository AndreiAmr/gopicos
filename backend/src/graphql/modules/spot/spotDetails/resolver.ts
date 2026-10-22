import { spotDetailsController } from '../../../../controllers/spot/spotDetails/spotDetails.controller';

import { fullName } from '../../../../utils/fullName';

type SpotDetailsResolverProps = {
  id: string;
};

export const spotDetailsResolver = {
  Query: {
    getSpotById: async (_: any, { id }: SpotDetailsResolverProps) => {
      return spotDetailsController(id);
    },
  },
  Author: {
    name: (author: { firstName: string; lastName: string }) => fullName(author),
  },
};
