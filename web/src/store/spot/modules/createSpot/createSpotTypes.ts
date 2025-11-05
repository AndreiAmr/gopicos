export enum CreateSpotActionTypes {
  CONTINUE_TO_NEXT_STEP = '@createSpot/createSpot/CONTINUE_TO_NEXT_STEP',
  SET_COORDINATES = '@createSpot/createSpot/SET_COORDINATES',
  SET_NEW_SPOT_PROPS = '@createSpot/createSpot/SET_NEW_SPOT_PROPS',
  FETCH_CREATE_SPOT = '@createSpot/createSpot/FETCH_CREATE_SPOT',
  SET_IS_LOADING_CREATE_SPOT = '@createSpot/createSpot/SET_IS_LOADING_CREATE_SPOT',
  SET_IS_ERROR_CREATE_SPOT = '@createSpot/createSpot/SET_IS_ERROR_CREATE_SPOT',
  SET_NEXT_STEP = '@createSpot/createSpot/SET_NEXT_STEP',
}

export type Orientation = 'portrait' | 'landscape' | 'square';

export type ImageProps = {
  url: string;
  orientation: Orientation;
  fileName: string;
  type: string;
};

export type ICoordinates = number[][][] | number[];

export interface ICreateSpot {
  coordinates: ICoordinates;
  name?: string;
  description?: string;
  road?: string;
  suburb?: string;
  number?: string;
  complement?: string;
  reference?: string;
  modality?: string;
  equipmentRequired?: boolean;
  isPaid?: boolean;
  entryAmount?: string;
  alwaysOpen?: boolean;
  openingHours?: string;
  hasCoverage?: boolean;
  markingType?: string;
  openingTime?: string;
  closingTime?: string;
}

export interface ICreateSpotModule {
  data: ICreateSpot;
  step: number;
  isLoading: boolean;
  isError: boolean;
}

export interface ICreateSpotState {
  createSpot: ICreateSpotModule;
}

export interface ICreateSpotPayload {
  coordinates?: ICoordinates;
  markingType?: string;
  step?: number;
  imageFiles?: File[];
  isLoading?: boolean;
  isError?: boolean;
  newSpotInfos?: Omit<ICreateSpot, 'coordinates'>;
}

export type ICreateSpotAction = {
  type: CreateSpotActionTypes;
  payload?: ICreateSpotPayload;
};

export type ICreateSpotReducer = (
  state: ICreateSpotState,
  payload?: ICreateSpotPayload,
) => ICreateSpotState;
