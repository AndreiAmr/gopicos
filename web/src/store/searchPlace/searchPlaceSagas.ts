import { call, put, takeLatest } from 'redux-saga/effects';

import { searchPlaceActions } from './searchPlaceActions';
import { searchPlaceRepository } from './searchPlaceRepository';
import {
  ISearchPlace,
  ISearchPlaceAction,
  SearchPlaceActionTypes,
} from './searchPlaceTypes';

export function* getSearchPlaceAsync({ payload }: ISearchPlaceAction) {
  try {
    if (!payload || !payload.searchValue) return;

    yield put(searchPlaceActions.setIsLoadingSearchPlace(true));
    yield put(searchPlaceActions.setIsErrorSearchPlace(false));
    const searchPlace: ISearchPlace[] = yield call(
      searchPlaceRepository.getSearchPlace,
      payload.searchValue,
    );

    yield put(searchPlaceActions.setSearchPlace(searchPlace));
  } catch {
    yield put(searchPlaceActions.setIsErrorSearchPlace(true));
  } finally {
    yield put(searchPlaceActions.setIsLoadingSearchPlace(false));
  }
}

const searchPlaceSagas = [
  takeLatest(
    SearchPlaceActionTypes.GET_SEARCH_PLACE_ASYNC,
    getSearchPlaceAsync,
  ),
];

export default searchPlaceSagas;
