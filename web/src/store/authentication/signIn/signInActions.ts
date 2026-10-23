import {
  SignInActionTypes,
  ISignInAction,
  ISignUpCredentials,
  SignInErrorType,
} from './signInTypes';

const getSignInAsync = (
  credentials: ISignUpCredentials,
  redirectTo?: string | null
): ISignInAction => ({
  type: SignInActionTypes.GET_SIGN_IN_ASYNC,
  payload: {
    credentials,
    redirectTo,
  },
});

const setIsLoadingSignIn = (isLoading: boolean): ISignInAction => ({
  payload: { isLoading },
  type: SignInActionTypes.SET_IS_LOADING_SIGN_IN,
});

const setErrorSignIn = (error: SignInErrorType | null): ISignInAction => ({
  payload: { error },
  type: SignInActionTypes.SET_ERROR_SIGN_IN,
});

export const signInActions = {
  getSignInAsync,
  setIsLoadingSignIn,
  setErrorSignIn,
};
