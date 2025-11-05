import { ApplicationState } from '@/store/types';

import { IReverseGeocoding, IReverseGeocodingState } from './reverseGeocodingTypes';

const getState = (state: ApplicationState): IReverseGeocodingState =>
  state.ReverseGeocoding;

const getReverseGeocoding = (state: ApplicationState): IReverseGeocoding | null =>
  getState(state).reverseGeocoding.data;

const getIsLoadingReverseGeocoding = (state: ApplicationState): boolean =>
  getState(state).reverseGeocoding.isLoading;

const getIsErrorReverseGeocoding = (state: ApplicationState): boolean =>
  getState(state).reverseGeocoding.isError;

export const reverseGeocodingSelectors = {
  getState,
  getReverseGeocoding,
  getIsLoadingReverseGeocoding,
  getIsErrorReverseGeocoding,
};
