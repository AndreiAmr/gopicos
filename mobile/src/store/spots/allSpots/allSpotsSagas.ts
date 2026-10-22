import { call, put, takeLatest } from 'redux-saga/effects';
import { getAllSpotsRepository } from './allSpotsRepository';
import { EAllSpotsCustomActionTypes, Spot } from './allSpotsTypes';
import { navigateToRoute, resetToRoute } from '../../../routes/navigationRef';
import { allSpotsActions } from './allSpotsSlice';

export function* getAllSpotsAsync() {
  yield call(navigateToRoute, {
    name: 'LoaderScreen',
    params: undefined,
  });

  const allSpots: Spot[] = yield call(getAllSpotsRepository.getAllSpots);

  yield put(allSpotsActions.setData(allSpots));

  yield call(resetToRoute, {
    name: 'Home',
    params: undefined,
  });
}

export const allSpotsSagas = [
  takeLatest(EAllSpotsCustomActionTypes.GET_ALL_SPOTS_ASYNC, getAllSpotsAsync),
];
