import { reverseGeocodingControllers } from '../../../../controllers/geocoding/reverseGeocoding';
import { ReverseGeocodingProps } from '../../../../datasource/geocoding/reverseGeocoding/reverseGeocodingTypes';

type Props = {
  input: ReverseGeocodingProps;
};

export const reverseGeocodingResolvers = {
  Query: {
    getReverseGeocoding: async (_: any, { input }: Props) => {
      return reverseGeocodingControllers.getReverseGeocoding(input);
    },
  },
};
