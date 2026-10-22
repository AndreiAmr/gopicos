import axios from 'axios';
import { ENDPOINTS } from '../../../config/endpoints';
import { ReverseGeocodingProps } from './reverseGeocodingTypes';

const getReverseGeocodingUrl = (props: ReverseGeocodingProps) => {
  return `${ENDPOINTS.locationiq.reverseGeocoding}?key=${process.env.LOCATION_IQ_KEY}&lat=${props.lat}&lon=${props.lng}&format=json&`;
};

const getReverseGeocoding = async (props: ReverseGeocodingProps) => {
  const url = getReverseGeocodingUrl(props);

  const response = await axios.get(url);

  return response.data;
};

export const reverseGeocodingDatasource = {
  getReverseGeocoding,
};
