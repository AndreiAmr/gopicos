import { produce } from 'immer';

import {
  SearchPlaceActionTypes,
  ISearchPlacePayload,
  ISearchPlaceState,
  ISearchPlaceReducer,
  ISearchPlaceAction,
} from './searchPlaceTypes';

const INITIAL_STATE: ISearchPlaceState = {
  searchPlace: { data: null, isLoading: false, isError: false },
};

const setSearchPlace: ISearchPlaceReducer = (
  state: ISearchPlaceState,
  payload?: ISearchPlacePayload
) =>
  produce(state, (draft) => {
    draft.searchPlace.data = payload?.searchPlace || null;
  });

const setIsLoadingSearchPlace: ISearchPlaceReducer = (
  state: ISearchPlaceState,
  payload?: ISearchPlacePayload
) =>
  produce(state, (draft) => {
    draft.searchPlace.isLoading = payload?.isLoading || false;
  });

const setIsErrorSearchPlace: ISearchPlaceReducer = (
  state: ISearchPlaceState,
  payload?: ISearchPlacePayload
) =>
  produce(state, (draft) => {
    draft.searchPlace.isError = payload?.isError || false;
  });

const searchPlaceReducerMap = new Map<
  SearchPlaceActionTypes,
  ISearchPlaceReducer
>([
  [SearchPlaceActionTypes.SET_SEARCH_PLACE, setSearchPlace],
  [SearchPlaceActionTypes.SET_IS_ERROR_SEARCH_PLACE, setIsErrorSearchPlace],
  [SearchPlaceActionTypes.SET_IS_LOADING_SEARCH_PLACE, setIsLoadingSearchPlace],
]);

const searchPlaceReducer = (
  state: ISearchPlaceState = INITIAL_STATE,
  action = {} as ISearchPlaceAction
): ISearchPlaceState => {
  const reducer = searchPlaceReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default searchPlaceReducer;
