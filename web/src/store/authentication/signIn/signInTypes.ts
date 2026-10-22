export enum SignInActionTypes {
  GET_SIGN_IN_ASYNC = '@signIn/signIn/GET_SIGN_IN_ASYNC',
  SET_SIGN_IN = '@signIn/signIn/SET_SIGN_IN',
  SET_IS_LOADING_SIGN_IN = '@signIn/signIn/SET_IS_LOADING_SIGN_IN',
  SET_ERROR_SIGN_IN = '@signIn/signIn/SET_ERROR_SIGN_IN',
}

/** Tipos de falha do login exibidos na tela (spec de autenticação, seções 3.2 e 4.3). */
export type SignInErrorType = 'invalid_credentials' | 'network' | 'server';

export interface ISignInModule {
  isLoading: boolean;
  error: SignInErrorType | null;
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
  error?: SignInErrorType | null;

  credentials?: ISignUpCredentials;
  /** Rota pretendida guardada pelo guard (GP-028); sem ela vai para /home. */
  redirectTo?: string | null;
}

export type ISignInAction = {
  type: SignInActionTypes;
  payload?: ISignInPayload;
};

export type ISignInReducer = (
  state: ISignInState,
  payload?: ISignInPayload
) => ISignInState;
