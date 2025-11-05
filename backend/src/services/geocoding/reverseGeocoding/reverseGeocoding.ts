import { reverseGeocodingDatasource } from '../../../datasource/geocoding/reverseGeocoding/reverseGeocodingDatasource';
import { ReverseGeocodingProps } from '../../../datasource/geocoding/reverseGeocoding/reverseGeocodingTypes';
import { ReverseGeocodingResponseModel } from '../../../models/geocoding/reverseGeocoding/ReverseGeocodingResponseModel';

const getReverseGeocoding = async (props: ReverseGeocodingProps) => {
  try {
    const datasourceResult =
      await reverseGeocodingDatasource.getReverseGeocoding(props);

    return new ReverseGeocodingResponseModel(datasourceResult);
  } catch {
    throw new Error('Localização não encontrada');
  }
};

export const reverseGeocodingServices = {
  getReverseGeocoding,
};
