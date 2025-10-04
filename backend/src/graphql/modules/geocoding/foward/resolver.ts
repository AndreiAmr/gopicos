import { fowardGeocodingControllers } from '../../../../controllers/geocoding/fowardGeocoding';
import { fowardGeocodingDatasource } from '../../../../datasource/geocoding/fowardGeocoding/fowardGeocodingDatasource';

type Props = {
  search: string;
};

export const fowardGeocodingResolvers = {
  Queries: {
    getFowardGeocoding: async (_: any, { search }: Props) => {
      const test = await fowardGeocodingControllers.getFowardGeocoding(search);

      return test;
    },
  },
};
