import { AddressProps } from '../../../datasource/geocoding/reverseGeocoding/reverseGeocodingTypes';

type ReverseGeocodingModelInterface = {
  road: string;
  suburb: string;
  quarter: string;
};

type ReverseGeocodingDTO = AddressProps & {};

export class ReverseGeocodingModel implements ReverseGeocodingModelInterface {
  quarter: string;
  road: string;
  suburb: string;

  constructor({ quarter, road, suburb, neighbourhood }: ReverseGeocodingDTO) {
    this.quarter = neighbourhood || quarter || '';
    this.road = road;
    this.suburb = suburb;
  }
}
