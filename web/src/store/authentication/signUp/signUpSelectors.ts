import { ApplicationState } from '@/store/types';

import { ISignUpState } from './signUpTypes';

const getState = (state: ApplicationState): ISignUpState =>
  state.Authentication.SignUp;

const getSignUpValues = (state: ApplicationState) =>
  getState(state).signUp.values;

const getIsLoadingSignUp = (state: ApplicationState): boolean =>
  getState(state).signUp.isLoading;

const getSignUpFieldError = (state: ApplicationState) =>
  getState(state).signUp.fieldError;

const getSignUpBannerError = (state: ApplicationState) =>
  getState(state).signUp.bannerError;

const getSignUpCanRetry = (state: ApplicationState) =>
  getState(state).signUp.canRetry;

export const signUpSelectors = {
  getState,
  getSignUpValues,
  getIsLoadingSignUp,
  getSignUpFieldError,
  getSignUpBannerError,
  getSignUpCanRetry,
};
