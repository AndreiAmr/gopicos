import {
  CreateSpotActionTypes,
  ICreateSpotAction,
  ICoordinates,
  ICreateSpot,
} from './createSpotTypes';

const continueToNextStep = (
  coordinates: ICoordinates,
  markingType: string,
): ICreateSpotAction => ({
  payload: { coordinates, markingType },
  type: CreateSpotActionTypes.CONTINUE_TO_NEXT_STEP,
});

const setCoordinates = (coordinates: ICoordinates): ICreateSpotAction => ({
  payload: { coordinates },
  type: CreateSpotActionTypes.SET_COORDINATES,
});

const setNextStep = (step: number): ICreateSpotAction => ({
  payload: { step },
  type: CreateSpotActionTypes.SET_NEXT_STEP,
});

const setNewSpotProps = (
  infos: Omit<ICreateSpot, 'coordinates'>,
): ICreateSpotAction => ({
  type: CreateSpotActionTypes.SET_NEW_SPOT_PROPS,
  payload: {
    newSpotInfos: infos,
  },
});

const fetchCreateSpot = (
  infos: Partial<ICreateSpot>,
  imageFiles: File[],
): ICreateSpotAction => ({
  type: CreateSpotActionTypes.FETCH_CREATE_SPOT,
  payload: {
    newSpotInfos: infos,
    imageFiles,
  },
});

const setIsLoadingCreateSpot = (isLoading: boolean): ICreateSpotAction => ({
  payload: { isLoading },
  type: CreateSpotActionTypes.SET_IS_LOADING_CREATE_SPOT,
});

const setIsErrorCreateSpot = (isError: boolean): ICreateSpotAction => ({
  payload: { isError },
  type: CreateSpotActionTypes.SET_IS_ERROR_CREATE_SPOT,
});

export const createSpotActions = {
  continueToNextStep,
  setNextStep,
  setIsLoadingCreateSpot,
  setIsErrorCreateSpot,
  setCoordinates,
  setNewSpotProps,
  fetchCreateSpot,
};
