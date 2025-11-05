import { ApplicationState } from '../types';
import { IProfile, IProfileState } from './profileTypes';

const getState = (state: ApplicationState): IProfileState => state.Profile;

const getProfile = (state: ApplicationState): IProfile | null =>
  getState(state).profile.data;

const getIsLoadingProfile = (state: ApplicationState): boolean =>
  getState(state).profile.isLoading;

const getIsErrorProfile = (state: ApplicationState): boolean =>
  getState(state).profile.isError;

export const profileSelectors = {
  getState,
  getProfile,
  getIsLoadingProfile,
  getIsErrorProfile,
};
