export enum ReverseGeocodingActionTypes {
  GET_REVERSE_GEOCODING_ASYNC = '@reverseGeocoding/reverseGeocoding/GET_REVERSE_GEOCODING_ASYNC',
  SET_REVERSE_GEOCODING = '@reverseGeocoding/reverseGeocoding/SET_REVERSE_GEOCODING',
  SET_IS_LOADING_REVERSE_GEOCODING = '@reverseGeocoding/reverseGeocoding/SET_IS_LOADING_REVERSE_GEOCODING',
  SET_IS_ERROR_REVERSE_GEOCODING = '@reverseGeocoding/reverseGeocoding/SET_IS_ERROR_REVERSE_GEOCODING',
}

export interface IReverseGeocoding {
  road: string;
  quarter: string;
  suburb: string;
}

export interface IReverseGeocodingModule {
  data: IReverseGeocoding | null;
  isLoading: boolean;
  isError: boolean;
}

export interface IReverseGeocodingState {
  reverseGeocoding: IReverseGeocodingModule;
}

export interface IReverseGeocodingPayload {
  reverseGeocoding?: IReverseGeocoding;
  isLoading?: boolean;
  lat?: number;
  lng?: number;
  isError?: boolean;
}

export type IReverseGeocodingAction = {
  type: ReverseGeocodingActionTypes;
  payload?: IReverseGeocodingPayload;
};

export type IReverseGeocodingReducer = (
  state: IReverseGeocodingState,
  payload?: IReverseGeocodingPayload
) => IReverseGeocodingState;
