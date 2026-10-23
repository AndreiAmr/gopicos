export enum UserProfileActionTypes {
  GET_ME_ASYNC = '@userProfile/me/GET_ME_ASYNC',
  SET_ME = '@userProfile/me/SET_ME',
  SET_IS_LOADING_ME = '@userProfile/me/SET_IS_LOADING_ME',
  SET_ERROR_ME = '@userProfile/me/SET_ERROR_ME',

  UPDATE_PROFILE_ASYNC = '@userProfile/update/UPDATE_PROFILE_ASYNC',
  SET_IS_LOADING_UPDATE = '@userProfile/update/SET_IS_LOADING_UPDATE',
  SET_ERROR_UPDATE = '@userProfile/update/SET_ERROR_UPDATE',

  CHANGE_PASSWORD_ASYNC = '@userProfile/password/CHANGE_PASSWORD_ASYNC',
  SET_IS_LOADING_PASSWORD = '@userProfile/password/SET_IS_LOADING_PASSWORD',
  SET_ERROR_PASSWORD = '@userProfile/password/SET_ERROR_PASSWORD',
  SET_SUCCESS_PASSWORD = '@userProfile/password/SET_SUCCESS_PASSWORD',
}

/** Perfil do usuário logado (query `me`). */
export interface IUserProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  spotsCount: number;
  reviewsCount: number;
}

/** Falha de carregamento exibida na tela (spec de perfil, seção 3). */
export type UserProfileLoadError = 'network' | 'server';

/** Erro de uma operação de escrita: no campo, banner ou sessão expirada. */
export type UserProfileOperationError =
  | { kind: 'field'; field: string; message: string }
  | { kind: 'banner'; message: string };

export interface IUserProfileState {
  me: {
    data: IUserProfile | null;
    isLoading: boolean;
    error: UserProfileLoadError | null;
  };
  update: {
    isLoading: boolean;
    error: UserProfileOperationError | null;
  };
  changePassword: {
    isLoading: boolean;
    error: UserProfileOperationError | null;
    /** true depois de trocar a senha; a tela limpa os campos e zera. */
    success: boolean;
  };
}

export interface IUpdateProfileInput {
  firstName: string;
  lastName: string;
}

export interface IChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface IUserProfilePayload {
  me?: IUserProfile | null;
  isLoading?: boolean;
  loadError?: UserProfileLoadError | null;
  operationError?: UserProfileOperationError | null;
  input?: IUpdateProfileInput;
  passwordInput?: IChangePasswordInput;
  success?: boolean;
}

export type IUserProfileAction = {
  type: UserProfileActionTypes;
  payload?: IUserProfilePayload;
};

export type IUserProfileReducer = (
  state: IUserProfileState,
  payload?: IUserProfilePayload,
) => IUserProfileState;
