import { ReverseGeocodingProps } from '../../datasource/geocoding/reverseGeocoding/reverseGeocodingTypes';
import { ReverseGeocodingModel } from '../../models/geocoding/reverseGeocoding/ReverseGeocodingModel';

import { reverseGeocodingServices } from '../../services/geocoding/reverseGeocoding/reverseGeocoding';

const getReverseGeocoding = async (props: ReverseGeocodingProps) => {
  const serviceResult = await reverseGeocodingServices.getReverseGeocoding(
    props
  );

  return new ReverseGeocodingModel(serviceResult.address);
};

export const reverseGeocodingControllers = {
  getReverseGeocoding,
};
