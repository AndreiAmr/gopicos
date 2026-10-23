import { ApplicationState } from '@/store/types';

import { ISignInState, SignInErrorType } from './signInTypes';

const getState = (state: ApplicationState): ISignInState =>
  state.Authentication.SignIn;

const getIsLoadingSignIn = (state: ApplicationState): boolean =>
  getState(state).signIn.isLoading;

const getErrorSignIn = (state: ApplicationState): SignInErrorType | null =>
  getState(state).signIn.error;

export const signInSelectors = {
  getState,
  getIsLoadingSignIn,
  getErrorSignIn,
};
