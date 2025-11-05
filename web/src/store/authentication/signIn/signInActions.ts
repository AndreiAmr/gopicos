import {
  SignInActionTypes,
  ISignInAction,
  ISignUpCredentials,
} from './signInTypes';

const getSignInAsync = (credentials: ISignUpCredentials): ISignInAction => ({
  type: SignInActionTypes.GET_SIGN_IN_ASYNC,
  payload: {
    credentials,
  },
});

const setIsLoadingSignIn = (isLoading: boolean): ISignInAction => ({
  payload: { isLoading },
  type: SignInActionTypes.SET_IS_LOADING_SIGN_IN,
});

const setIsErrorSignIn = (isError: boolean): ISignInAction => ({
  payload: { isError },
  type: SignInActionTypes.SET_IS_ERROR_SIGN_IN,
});

export const signInActions = {
  getSignInAsync,
  setIsLoadingSignIn,
  setIsErrorSignIn,
};
