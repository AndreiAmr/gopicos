import { FowardGeoCodingResult } from '../../datasource/geocoding/fowardGeocoding/fowardGeocodingTypes';

type FowardGeocodingDTOProps = {
  name: string;
  lat: number;
  lng: number;
  road: string;
  district?: string;
  suburb: string;
  city: string;
  state: string;
  boundingBox: number[];
};

export class fowardGeocodingDTO implements FowardGeocodingDTOProps {
  name: string;
  lat: number;
  lng: number;
  road: string;
  district?: string;
  suburb: string;
  city: string;
  state: string;
  boundingBox: number[];

  constructor(props: FowardGeoCodingResult) {
    this.name = props.address.road;
    this.lat = Number(props.lat);
    this.lng = Number(props.lon);
    this.road = props.address.road;
    this.district = props.address.quarter;
    this.suburb = props.address.suburb;
    this.city = props.address.city;
    this.state = props.address.state;
    this.boundingBox = props.boundingbox.map((item) => Number(item));
  }
}
