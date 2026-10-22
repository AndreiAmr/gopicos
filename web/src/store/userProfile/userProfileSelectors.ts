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

const getIsLoadingPassword = (state: ApplicationState): boolean =>
  getState(state).changePassword.isLoading;

const getErrorPassword = (
  state: ApplicationState,
): UserProfileOperationError | null => getState(state).changePassword.error;

const getSuccessPassword = (state: ApplicationState): boolean =>
  getState(state).changePassword.success;

export const userProfileSelectors = {
  getIsLoadingPassword,
  getErrorPassword,
  getSuccessPassword,
  getState,
  getMe,
  getIsLoadingMe,
  getErrorMe,
  getIsLoadingUpdate,
  getErrorUpdate,
};
