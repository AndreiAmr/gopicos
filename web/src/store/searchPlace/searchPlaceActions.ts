import {
  ISearchPlace,
  SearchPlaceActionTypes,
  ISearchPlaceAction,
} from './searchPlaceTypes';

const getSearchPlaceAsync = (searchValue: string): ISearchPlaceAction => ({
  type: SearchPlaceActionTypes.GET_SEARCH_PLACE_ASYNC,
  payload: {
    searchValue,
  },
});

const setSearchPlace = (searchPlace: ISearchPlace[]): ISearchPlaceAction => ({
  payload: { searchPlace },
  type: SearchPlaceActionTypes.SET_SEARCH_PLACE,
});

const setIsLoadingSearchPlace = (isLoading: boolean): ISearchPlaceAction => ({
  payload: { isLoading },
  type: SearchPlaceActionTypes.SET_IS_LOADING_SEARCH_PLACE,
});

const setIsErrorSearchPlace = (isError: boolean): ISearchPlaceAction => ({
  payload: { isError },
  type: SearchPlaceActionTypes.SET_IS_ERROR_SEARCH_PLACE,
});

export const searchPlaceActions = {
  getSearchPlaceAsync,
  setSearchPlace,
  setIsLoadingSearchPlace,
  setIsErrorSearchPlace,
};
