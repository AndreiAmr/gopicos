type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type IsArray<T> = T extends readonly unknown[] ? true : false;

type NestedPaths<T, Prev extends string = ''> = {
  [K in keyof T]: T[K] extends Primitive | File
    ? `${Prev}${K & string}`
    : IsArray<T[K]> extends true
    ? `${Prev}${K & string}`
    : `${Prev}${K & string}` | NestedPaths<T[K], `${Prev}${K & string}.`>;
}[keyof T];

type NominatimResultProps = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    road: string;
    quarter: string;
    suburb: string;
    city: string;
    municipality: string;
    county: string;
    state: string;
    region: string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: string[];
};

type PlaceProps = {
  name: string;
  displayName: string;
  country: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};
