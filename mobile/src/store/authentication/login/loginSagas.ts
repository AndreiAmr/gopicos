import { put, takeLatest } from 'redux-saga/effects';
import { loginActions } from './loginSlice';

export function* getLoginAsync() {
  try {
    yield put(loginActions.setIsLoading(true));

    yield put(loginActions.setIsError(false));

  } catch {
    yield put(loginActions.setIsError(true));
  } finally {
    yield put(loginActions.setIsLoading(false));
  }
}

export const loginSagas = [
  takeLatest(loginActions.getLoginAsync.type, getLoginAsync),
];
