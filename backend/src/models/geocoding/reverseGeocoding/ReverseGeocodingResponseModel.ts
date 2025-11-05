import {
  ReverseGeocodingResponse,
  AddressProps,
} from '../../../datasource/geocoding/reverseGeocoding/reverseGeocodingTypes';

export class ReverseGeocodingResponseModel implements ReverseGeocodingResponse {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: AddressProps;
  boundingbox: string[];

  constructor({
    address,
    boundingbox,
    display_name,
    lat,
    licence,
    lon,
    osm_id,
    osm_type,
    place_id,
  }: ReverseGeocodingResponse) {
    this.address = address;
    this.boundingbox = boundingbox;
    this.display_name = display_name;
    this.lat = lat;
    this.licence = licence;
    this.lon = lon;
    this.osm_id = osm_id;
    this.osm_type = osm_type;
    this.place_id = place_id;
  }
}
