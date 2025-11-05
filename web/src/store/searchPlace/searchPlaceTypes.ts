export enum SearchPlaceActionTypes {
  GET_SEARCH_PLACE_ASYNC = '@searchPlace/searchPlace/GET_SEARCH_PLACE_ASYNC',
  SET_SEARCH_PLACE = '@searchPlace/searchPlace/SET_SEARCH_PLACE',
  SET_IS_LOADING_SEARCH_PLACE = '@searchPlace/searchPlace/SET_IS_LOADING_SEARCH_PLACE',
  SET_IS_ERROR_SEARCH_PLACE = '@searchPlace/searchPlace/SET_IS_ERROR_SEARCH_PLACE',
}

export interface ISearchPlace {
  name: string;
  lat: number;
  lng: number;
  road: string;
  district: string;
  suburb: string;
  city: string;
  state: string;
  boundingBox: number[];
}

export interface ISearchPlaceModule {
  data: ISearchPlace[] | null;
  isLoading: boolean;
  isError: boolean;
}

export interface ISearchPlaceState {
  searchPlace: ISearchPlaceModule;
}

export interface ISearchPlacePayload {
  searchValue?: string;
  searchPlace?: ISearchPlace[];
  isLoading?: boolean;
  isError?: boolean;
}

export type ISearchPlaceAction = {
  type: SearchPlaceActionTypes;
  payload?: ISearchPlacePayload;
};

export type ISearchPlaceReducer = (
  state: ISearchPlaceState,
  payload?: ISearchPlacePayload
) => ISearchPlaceState;
