import { LocationMarkingTypeModel } from '../../../models/spot/locationMarkingTypeModel';
import { getAllLocationMarkingTypesServices } from '../../../services/spot/locationMarkinType/locationMarkingType.service';

export const getAllLocationMarkingTypesController = async (): Promise<
  LocationMarkingTypeModel[]
> => {
  const options = await getAllLocationMarkingTypesServices();

  return options.map((opt) => new LocationMarkingTypeModel(opt));
};
