import { getAllLocationMarkingTypesController } from '../../../../controllers/spot/locationMarkingType/locationMarkingtType.controller';

export const locationMarkingTypeResolvers = {
  Query: {
    getAllLocationMarkingType: () => {
      return getAllLocationMarkingTypesController();
    },
  },
};
