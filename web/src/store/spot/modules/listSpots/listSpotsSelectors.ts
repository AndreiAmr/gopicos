import { ApplicationState } from '@/store/types';

import { IListSpots, IListSpotsState } from './listSpotsTypes';

const getState = (state: ApplicationState): IListSpotsState =>
  state.Spots.ListSpots;

const getListSpots = (state: ApplicationState): IListSpots[] | null =>
  getState(state).listSpots.data;

const getIsLoadingListSpots = (state: ApplicationState): boolean =>
  getState(state).listSpots.isLoading;

const getIsErrorListSpots = (state: ApplicationState): boolean =>
  getState(state).listSpots.isError;

export const listSpotsSelectors = {
  getState,
  getListSpots,
  getIsLoadingListSpots,
  getIsErrorListSpots,
};
