import { fowardGeocodingDatasource } from '../../../datasource/geocoding/fowardGeocoding/fowardGeocodingDatasource';
import { fowardGeocodingDTO } from '../../../dtos/fowardGeocoding/fowardGeocodingDTO';

const getFowardGeocoding = async (query: string) => {
  const result = await fowardGeocodingDatasource.getFowardGeocoding(query);

  const notEmptyResults = result.filter(
    (item) =>
      (item.address.road ||
        item.address.quarter ||
        item.address.city ||
        item.address.suburb) &&
      item.lat &&
      item.lon
  );

  return notEmptyResults.map((item) => new fowardGeocodingDTO(item));
};

export const fowardGeocodingServices = {
  getFowardGeocoding,
};
