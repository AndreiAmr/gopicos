import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './rootReducer';
import { rootSaga, sagaMiddleware } from './rootSagas';

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
