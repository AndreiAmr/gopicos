export enum SignInActionTypes {
  GET_SIGN_IN_ASYNC = '@signIn/signIn/GET_SIGN_IN_ASYNC',
  SET_SIGN_IN = '@signIn/signIn/SET_SIGN_IN',
  SET_IS_LOADING_SIGN_IN = '@signIn/signIn/SET_IS_LOADING_SIGN_IN',
  SET_IS_ERROR_SIGN_IN = '@signIn/signIn/SET_IS_ERROR_SIGN_IN',
}

export interface ISignInModule {
  isLoading: boolean;
  isError: boolean;
}

export interface ISignInState {
  signIn: ISignInModule;
}

export type ISignUpCredentials = {
  email: string;
  password: string;
};

export interface ISignInPayload {
  isLoading?: boolean;
  isError?: boolean;

  credentials?: ISignUpCredentials;
}

export type ISignInAction = {
  type: SignInActionTypes;
  payload?: ISignInPayload;
};

export type ISignInReducer = (
  state: ISignInState,
  payload?: ISignInPayload
) => ISignInState;
