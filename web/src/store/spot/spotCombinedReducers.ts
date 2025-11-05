import { combineReducers } from 'redux';

import listSpotsReducer from './modules/listSpots/listSpotsReducer';
import createSpotReducer from './modules/createSpot/createSpotReducer';

export const spotsCombinedReducers = combineReducers({
  ListSpots: listSpotsReducer,
  CreateSpot: createSpotReducer,
});
