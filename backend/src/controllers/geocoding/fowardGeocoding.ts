import { fowardGeocodingDatasource } from '../../datasource/geocoding/fowardGeocoding/fowardGeocodingDatasource';
import { fowardGeocodingServices } from '../../services/geocoding/fowardGeocoding/fowardGeocoding';

const getFowardGeocoding = async (query: string) => {
  const resultDTOs = await fowardGeocodingServices.getFowardGeocoding(query);

  return resultDTOs;
};

export const fowardGeocodingControllers = {
  getFowardGeocoding,
};
