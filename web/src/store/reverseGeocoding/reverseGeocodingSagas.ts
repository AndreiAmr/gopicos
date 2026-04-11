import { call, put, takeLatest } from 'redux-saga/effects';

import { reverseGeocodingActions } from './reverseGeocodingActions';
import { reverseGeocodingRepository } from './reverseGeocodingRepository';
import {
  IReverseGeocoding,
  IReverseGeocodingAction,
  ReverseGeocodingActionTypes,
} from './reverseGeocodingTypes';

export function* getReverseGeocodingAsync({
  payload,
}: IReverseGeocodingAction) {
  try {
    if (!payload || !payload.lat || !payload.lng) return;

    yield put(reverseGeocodingActions.setIsLoadingReverseGeocoding(true));
    yield put(reverseGeocodingActions.setIsErrorReverseGeocoding(false));

    const params = {
      lat: payload.lat,
      lng: payload.lng,
    };

    const reverseGeocoding: IReverseGeocoding = yield call(
      reverseGeocodingRepository.getReverseGeocoding,
      params,
    );

    yield put(reverseGeocodingActions.setReverseGeocoding(reverseGeocoding));
  } catch {
    yield put(reverseGeocodingActions.setIsErrorReverseGeocoding(true));
  } finally {
    yield put(reverseGeocodingActions.setIsLoadingReverseGeocoding(false));
  }
}

const reverseGeocodingSagas = [
  takeLatest(
    ReverseGeocodingActionTypes.GET_REVERSE_GEOCODING_ASYNC,
    getReverseGeocodingAsync,
  ),
];

export default reverseGeocodingSagas;
