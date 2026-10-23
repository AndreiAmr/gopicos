import { ApplicationState } from '@/store/types';

import {
  IUserProfile,
  IUserProfileState,
  UserProfileLoadError,
  UserProfileOperationError,
} from './userProfileTypes';

const getState = (state: ApplicationState): IUserProfileState =>
  state.UserProfile;

const getMe = (state: ApplicationState): IUserProfile | null =>
  getState(state).me.data;

const getIsLoadingMe = (state: ApplicationState): boolean =>
  getState(state).me.isLoading;

const getErrorMe = (state: ApplicationState): UserProfileLoadError | null =>
  getState(state).me.error;

const getIsLoadingUpdate = (state: ApplicationState): boolean =>
  getState(state).update.isLoading;

const getErrorUpdate = (
  state: ApplicationState,
): UserProfileOperationError | null => getState(state).update.error;

export const userProfileSelectors = {
  getState,
  getMe,
  getIsLoadingMe,
  getErrorMe,
  getIsLoadingUpdate,
  getErrorUpdate,
};
