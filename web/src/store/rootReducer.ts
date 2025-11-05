import { combineReducers } from '@reduxjs/toolkit';
import profileReducer from './profile/profileReducer';
import { authenticationCombinedReducer } from './authentication/authenticationCombinedReducer';
import { spotsCombinedReducers } from './spot/spotCombinedReducers';
import searchPlaceReducer from './searchPlace/searchPlaceReducer';
import reverseGeocodingReducer from './reverseGeocoding/reverseGeocodingReducer';

export const rootReducer = combineReducers({
  Profile: profileReducer,
  Authentication: authenticationCombinedReducer,
  Spots: spotsCombinedReducers,
  SearchPlace: searchPlaceReducer,
  ReverseGeocoding: reverseGeocodingReducer,
});
