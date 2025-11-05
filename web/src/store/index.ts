import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import createSagaMiddleware from 'redux-saga';
import { rootSagas } from './rootSagas';

export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSagas);
