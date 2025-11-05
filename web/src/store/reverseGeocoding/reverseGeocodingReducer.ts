import { produce } from 'immer';

import {
  ReverseGeocodingActionTypes,
  IReverseGeocodingPayload,
  IReverseGeocodingState,
  IReverseGeocodingReducer,
  IReverseGeocodingAction,
} from './reverseGeocodingTypes';

const INITIAL_STATE: IReverseGeocodingState = {
  reverseGeocoding: { data: null, isLoading: false, isError: false },
};

const setReverseGeocoding: IReverseGeocodingReducer = (
  state: IReverseGeocodingState,
  payload?: IReverseGeocodingPayload
) =>
  produce(state, (draft) => {
    draft.reverseGeocoding.data = payload?.reverseGeocoding || null;
  });

const setIsLoadingReverseGeocoding: IReverseGeocodingReducer = (
  state: IReverseGeocodingState,
  payload?: IReverseGeocodingPayload
) =>
  produce(state, (draft) => {
    draft.reverseGeocoding.isLoading = payload?.isLoading || false;
  });

const setIsErrorReverseGeocoding: IReverseGeocodingReducer = (
  state: IReverseGeocodingState,
  payload?: IReverseGeocodingPayload
) =>
  produce(state, (draft) => {
    draft.reverseGeocoding.isError = payload?.isError || false;
  });

const reverseGeocodingReducerMap = new Map<
  ReverseGeocodingActionTypes,
  IReverseGeocodingReducer
>([
  [ReverseGeocodingActionTypes.SET_REVERSE_GEOCODING, setReverseGeocoding],
  [
    ReverseGeocodingActionTypes.SET_IS_ERROR_REVERSE_GEOCODING,
    setIsErrorReverseGeocoding,
  ],
  [
    ReverseGeocodingActionTypes.SET_IS_LOADING_REVERSE_GEOCODING,
    setIsLoadingReverseGeocoding,
  ],
]);

const reverseGeocodingReducer = (
  state: IReverseGeocodingState = INITIAL_STATE,
  action = {} as IReverseGeocodingAction
): IReverseGeocodingState => {
  const reducer = reverseGeocodingReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default reverseGeocodingReducer;
