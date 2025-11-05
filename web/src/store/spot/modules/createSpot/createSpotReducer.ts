import { produce } from 'immer';

import {
  CreateSpotActionTypes,
  ICreateSpotPayload,
  ICreateSpotState,
  ICreateSpotReducer,
  ICreateSpotAction,
} from './createSpotTypes';

const INITIAL_STATE: ICreateSpotState = {
  createSpot: {
    data: {
      coordinates: [],
    },
    step: 0,
    isLoading: false,
    isError: false,
  },
};

const setIsLoadingCreateSpot: ICreateSpotReducer = (
  state: ICreateSpotState,
  payload?: ICreateSpotPayload,
) =>
  produce(state, (draft) => {
    draft.createSpot.isLoading = payload?.isLoading || false;
  });

const setIsErrorCreateSpot: ICreateSpotReducer = (
  state: ICreateSpotState,
  payload?: ICreateSpotPayload,
) =>
  produce(state, (draft) => {
    draft.createSpot.isError = payload?.isError || false;
  });

const setCoordinates: ICreateSpotReducer = (
  state: ICreateSpotState,
  payload?: ICreateSpotPayload,
) =>
  produce(state, (draft) => {
    draft.createSpot.data.coordinates = payload?.coordinates || [];
  });
const setNextStep: ICreateSpotReducer = (
  state: ICreateSpotState,
  payload?: ICreateSpotPayload,
) =>
  produce(state, (draft) => {
    draft.createSpot.step = payload?.step || 0;
  });

const setNewSpotProps: ICreateSpotReducer = (
  state: ICreateSpotState,
  payload?: ICreateSpotPayload,
) =>
  produce(state, (draft) => {
    if (!payload) return;

    const { ...rest } = payload;

    draft.createSpot.data = {
      ...draft.createSpot.data,
      ...rest.newSpotInfos,
    };
  });

const createSpotReducerMap = new Map<CreateSpotActionTypes, ICreateSpotReducer>(
  [
    [CreateSpotActionTypes.SET_IS_ERROR_CREATE_SPOT, setIsErrorCreateSpot],
    [CreateSpotActionTypes.SET_IS_LOADING_CREATE_SPOT, setIsLoadingCreateSpot],
    [CreateSpotActionTypes.SET_NEW_SPOT_PROPS, setNewSpotProps],
    [CreateSpotActionTypes.SET_COORDINATES, setCoordinates],
    [CreateSpotActionTypes.SET_NEXT_STEP, setNextStep],
  ],
);

const createSpotReducer = (
  state: ICreateSpotState = INITIAL_STATE,
  action = {} as ICreateSpotAction,
): ICreateSpotState => {
  const reducer = createSpotReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default createSpotReducer;
