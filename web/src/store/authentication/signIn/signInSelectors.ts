import { ApplicationState } from '@/store/types';

import { ISignInState } from './signInTypes';

const getState = (state: ApplicationState): ISignInState =>
  state.Authentication.SignIn;

const getIsLoadingSignIn = (state: ApplicationState): boolean =>
  getState(state).signIn.isLoading;

const getIsErrorSignIn = (state: ApplicationState): boolean =>
  getState(state).signIn.isError;

export const signInSelectors = {
  getState,
  getIsLoadingSignIn,
  getIsErrorSignIn,
};
