import axios from 'axios';
import { ENDPOINTS } from '../../../config/endpoints';
import { FowardGeoCodingResult } from './fowardGeocodingTypes';

const getFowardGeocodingUrl = (search: string) => {
  const encodedQuery = encodeURIComponent(search);

  return `${ENDPOINTS.locationiq.fowardGeocoding}?key=${process.env.LOCATION_IQ_KEY}&q=${encodedQuery}&addressdetails=1&accept-language=pt&format=json&`;
};

const getFowardGeocoding = async (
  query: string
): Promise<FowardGeoCodingResult[]> => {
  const fullUrl = getFowardGeocodingUrl(query);
  const result = await axios.get(fullUrl);

  return result.data;
};

export const fowardGeocodingDatasource = {
  getFowardGeocoding,
};
