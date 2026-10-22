import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { loginSagas } from './authentication/login/loginSagas';
import { allSpotsSagas } from './spots/allSpots/allSpotsSagas';

type SagaGroup = ReadonlyArray<unknown>;

export const sagaMiddleware = createSagaMiddleware();

export const combineSagas = (...groups: SagaGroup[]) => {
  return function* rootSaga() {
    yield all(groups.flat() as any[]);
  };
};

export const rootSaga = combineSagas([...loginSagas, ...allSpotsSagas]);
