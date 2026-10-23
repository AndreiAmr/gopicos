import type { SpotsQueryFilter } from '@/domain/spot/filters';
import {
  IListSpots,
  ListSpotsActionTypes,
  IListSpotsAction,
} from './listSpotsTypes';

const getListSpotsAsync = (filter?: SpotsQueryFilter | null): IListSpotsAction => ({
  payload: { filter: filter ?? null },
  type: ListSpotsActionTypes.GET_LIST_SPOTS_ASYNC,
});

const setListSpots = (
  listSpots: IListSpots[],
): IListSpotsAction => ({
  payload: { listSpots },
  type: ListSpotsActionTypes.SET_LIST_SPOTS,
});

const setIsLoadingListSpots = (isLoading: boolean): IListSpotsAction => ({
  payload: { isLoading },
  type: ListSpotsActionTypes.SET_IS_LOADING_LIST_SPOTS,
});

const setIsErrorListSpots = (isError: boolean): IListSpotsAction => ({
  payload: { isError },
  type: ListSpotsActionTypes.SET_IS_ERROR_LIST_SPOTS,
});


export const listSpotsActions = {
  getListSpotsAsync,
  setListSpots,
  setIsLoadingListSpots,
  setIsErrorListSpots,
};
