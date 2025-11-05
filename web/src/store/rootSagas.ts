import { all } from 'redux-saga/effects';

import { authenticationCombinedSagas } from './authentication/authenticationCombinedSagas';
import { spotCombinedSagas } from './spot/spotCombinedSagas';
import searchPlaceSagas from './searchPlace/searchPlaceSagas';
import reverseGeocodingSagas from './reverseGeocoding/reverseGeocodingSagas';

export function* rootSagas() {
  yield all([
    ...authenticationCombinedSagas,
    ...spotCombinedSagas,
    ...searchPlaceSagas,
    ...reverseGeocodingSagas,
  ]);
}
