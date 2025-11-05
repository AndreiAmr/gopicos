import { gql } from '@apollo/client';

export type IFowardGeocodingResponse = {
  name: string;
  lat?: number;
  lng?: number;
  city?: string;
  district?: string;
  suburb?: string;
  boundingBox?: number[];
};
export type IFowardGeocoding = {
  getFowardGeocoding: IFowardGeocodingResponse[];
};

export const fowardGeocodingQuery = gql`
  query FowardGeocoding($search: String!) {
    getFowardGeocoding(search: $search) {
      name
      lat
      lng
      city
      district
      suburb
      boundingBox
    }
  }
`;

// export const getFowardGeocoding = async (search: string) => {
//   const { data } = await apolloClient.query<IFowardGeocoding>({
//     query: fowardGeocodingQuery,
//     variables: {
//       search,
//     },
//   });

//   return data.getFowardGeocoding;
// };
