import { call, put, takeLatest } from 'redux-saga/effects';

import { listSpotsActions } from './listSpotsActions';
import { listSpotsRepository } from './listSpotsRepository';
import {
  IListSpots,
  IListSpotsAction,
  ListSpotsActionTypes,
} from './listSpotsTypes';

export function* getListSpotsAsync(action?: IListSpotsAction) {
  try {
    yield put(listSpotsActions.setIsLoadingListSpots(true));
    yield put(listSpotsActions.setIsErrorListSpots(false));
    const listSpots: IListSpots = yield call(
      listSpotsRepository.getListSpots,
      action?.payload?.filter ?? null,
    );

    yield put(listSpotsActions.setListSpots(listSpots));
  } catch  {
    yield put(listSpotsActions.setIsErrorListSpots(true));
  } finally {
    yield put(listSpotsActions.setIsLoadingListSpots(false));
  }
}

const listSpotsSagas = [
  takeLatest(
    ListSpotsActionTypes.GET_LIST_SPOTS_ASYNC,
    getListSpotsAsync,
  ),
];

export default listSpotsSagas;
