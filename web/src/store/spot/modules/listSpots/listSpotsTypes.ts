import { ISpot } from '../../spotTypes';

export enum ListSpotsActionTypes {
  GET_LIST_SPOTS_ASYNC = '@listSpots/listSpots/GET_LIST_SPOTS_ASYNC',
  SET_LIST_SPOTS = '@listSpots/listSpots/SET_LIST_SPOTS',
  SET_IS_LOADING_LIST_SPOTS = '@listSpots/listSpots/SET_IS_LOADING_LIST_SPOTS',
  SET_IS_ERROR_LIST_SPOTS = '@listSpots/listSpots/SET_IS_ERROR_LIST_SPOTS',
}

export type IListSpots = ISpot;

export interface IListSpotsModule {
  data: IListSpots[] | null;
  isLoading: boolean;
  isError: boolean;
}

export interface IListSpotsState {
  listSpots: IListSpotsModule;
}

export interface IListSpotsPayload {
  listSpots?: IListSpots;
  isLoading?: boolean;
  isError?: boolean;
}

export type IListSpotsAction = {
  type: ListSpotsActionTypes;
  payload?: IListSpotsPayload;
};

export type IListSpotsReducer = (
  state: IListSpotsState,
  payload?: IListSpotsPayload
) => IListSpotsState;
