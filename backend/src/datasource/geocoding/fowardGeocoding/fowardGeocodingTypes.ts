type AddressProps = {
  road: string;
  residential: string;
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
  quarter?: string;
};

export type FowardGeoCodingResult = {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address: AddressProps;
};
