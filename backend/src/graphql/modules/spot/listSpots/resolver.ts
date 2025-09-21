import { listAllSpotsController } from '../../../../controllers/spot/listAllSpots/listAllSpots.controller';

export const listSpotsResolvers = {
  Query: {
    getAllSpots: async () => {
      return await listAllSpotsController();
    },
  },
};
