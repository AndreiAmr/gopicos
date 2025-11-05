import { ApplicationState } from '@/store/types';

import { ISearchPlace, ISearchPlaceState } from './searchPlaceTypes';

const getState = (state: ApplicationState): ISearchPlaceState =>
  state.SearchPlace;

const getSearchPlace = (state: ApplicationState): ISearchPlace[] | null =>
  getState(state).searchPlace.data;

const getIsLoadingSearchPlace = (state: ApplicationState): boolean =>
  getState(state).searchPlace.isLoading;

const getIsErrorSearchPlace = (state: ApplicationState): boolean =>
  getState(state).searchPlace.isError;

export const searchPlaceSelectors = {
  getState,
  getSearchPlace,
  getIsLoadingSearchPlace,
  getIsErrorSearchPlace,
};
