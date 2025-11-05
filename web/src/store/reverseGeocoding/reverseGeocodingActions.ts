import {
  IReverseGeocoding,
  ReverseGeocodingActionTypes,
  IReverseGeocodingAction,
} from './reverseGeocodingTypes';

const getReverseGeocodingAsync = (
  lat: number,
  lng: number
): IReverseGeocodingAction => ({
  type: ReverseGeocodingActionTypes.GET_REVERSE_GEOCODING_ASYNC,
  payload: {
    lat,
    lng,
  },
});

const setReverseGeocoding = (
  reverseGeocoding: IReverseGeocoding
): IReverseGeocodingAction => ({
  payload: { reverseGeocoding },
  type: ReverseGeocodingActionTypes.SET_REVERSE_GEOCODING,
});

const setIsLoadingReverseGeocoding = (
  isLoading: boolean
): IReverseGeocodingAction => ({
  payload: { isLoading },
  type: ReverseGeocodingActionTypes.SET_IS_LOADING_REVERSE_GEOCODING,
});

const setIsErrorReverseGeocoding = (
  isError: boolean
): IReverseGeocodingAction => ({
  payload: { isError },
  type: ReverseGeocodingActionTypes.SET_IS_ERROR_REVERSE_GEOCODING,
});

export const reverseGeocodingActions = {
  getReverseGeocodingAsync,
  setReverseGeocoding,
  setIsLoadingReverseGeocoding,
  setIsErrorReverseGeocoding,
};
