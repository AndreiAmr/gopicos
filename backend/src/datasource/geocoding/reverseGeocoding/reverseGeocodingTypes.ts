export type ReverseGeocodingProps = {
  lat: number;
  lng: number;
};

export type AddressProps = {
  road: string;
  quarter: string;
  suburb: string;
  city: string;
  municipality: string;
  county: string;
  state_district: string;
  state: string;
  region: string;
  postcode: string;
  country: string;
  country_code: string;
  neighbourhood?: string;
};

export type ReverseGeocodingResponse = {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: AddressProps;
  boundingbox: string[];
};
