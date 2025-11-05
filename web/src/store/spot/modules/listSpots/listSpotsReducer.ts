import { produce } from 'immer';

import {
  ListSpotsActionTypes,
  IListSpotsPayload,
  IListSpotsState,
  IListSpotsReducer,
  IListSpotsAction,
} from './listSpotsTypes';

const INITIAL_STATE: IListSpotsState = {
  listSpots: { data: null, isLoading: false, isError: false },
};

const setListSpots: IListSpotsReducer = (
  state: IListSpotsState,
  payload?: IListSpotsPayload
) =>
  produce(state, (draft) => {
    draft.listSpots.data = payload?.listSpots || null;
  });

const setIsLoadingListSpots: IListSpotsReducer = (
  state: IListSpotsState,
  payload?: IListSpotsPayload
) =>
  produce(state, (draft) => {
    draft.listSpots.isLoading = payload?.isLoading || false;
  });

const setIsErrorListSpots: IListSpotsReducer = (
  state: IListSpotsState,
  payload?: IListSpotsPayload
) =>
  produce(state, (draft) => {
    draft.listSpots.isError = payload?.isError || false;
  });

const listSpotsReducerMap = new Map<ListSpotsActionTypes, IListSpotsReducer>([
  [ListSpotsActionTypes.SET_LIST_SPOTS, setListSpots],
  [ListSpotsActionTypes.SET_IS_ERROR_LIST_SPOTS, setIsErrorListSpots],
  [ListSpotsActionTypes.SET_IS_LOADING_LIST_SPOTS, setIsLoadingListSpots],
]);

const listSpotsReducer = (
  state: IListSpotsState = INITIAL_STATE,
  action = {} as IListSpotsAction
): IListSpotsState => {
  const reducer = listSpotsReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default listSpotsReducer;
