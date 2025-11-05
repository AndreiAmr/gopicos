import { ApplicationState } from '@/store/types';

import { ICoordinates, ICreateSpot, ICreateSpotState } from './createSpotTypes';

const getState = (state: ApplicationState): ICreateSpotState =>
  state.Spots.CreateSpot;

const getCreateSpot = (state: ApplicationState): ICreateSpot | null =>
  getState(state).createSpot.data;

const getStep = (state: ApplicationState): number =>
  getState(state).createSpot.step;

const getCreateSpotCoordinates = (
  state: ApplicationState,
): ICoordinates | undefined => getState(state).createSpot.data?.coordinates;

const getIsLoadingCreateSpot = (state: ApplicationState): boolean =>
  getState(state).createSpot.isLoading;

const getIsErrorCreateSpot = (state: ApplicationState): boolean =>
  getState(state).createSpot.isError;

export const createSpotSelectors = {
  getState,
  getCreateSpot,
  getIsLoadingCreateSpot,
  getIsErrorCreateSpot,
  getCreateSpotCoordinates,
  getStep,
};
