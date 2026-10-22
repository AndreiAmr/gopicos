import { listAllSpotsController } from '../../../../controllers/spot/listAllSpots/listAllSpots.controller';
import { SpotsFilter } from '../../../../database/repositories/Spot';

export const listSpotsResolvers = {
  Query: {
    getAllSpots: async (_: unknown, { filter }: { filter?: SpotsFilter }) => {
      return await listAllSpotsController(filter);
    },
  },
};
