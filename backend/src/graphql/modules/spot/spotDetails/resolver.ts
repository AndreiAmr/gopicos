import { spotDetailsController } from '../../../../controllers/spot/spotDetails/spotDetails.controller';

type SpotDetailsResolverProps = {
  id: string;
};

export const spotDetailsResolver = {
  Query: {
    getSpotById: async (_: any, { id }: SpotDetailsResolverProps) => {
      return spotDetailsController(id);
    },
  },
};
