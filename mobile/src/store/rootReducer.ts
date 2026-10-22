import { combineReducers } from 'redux';
import { LoginSliceName, loginSlice } from './authentication/login/loginSlice';
import {
  AllSpotsSliceName,
  allSpotsSlice,
} from './spots/allSpots/allSpotsSlice';

export const reducers = combineReducers({
  [LoginSliceName]: loginSlice.reducer,
  [AllSpotsSliceName]: allSpotsSlice.reducer,
});
