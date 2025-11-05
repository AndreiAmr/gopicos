export enum ProfileActionTypes {
  GET_PROFILE_ASYNC = '@profile/profile/GET_PROFILE_ASYNC',
  SET_PROFILE = '@profile/profile/SET_PROFILE',
  SET_IS_LOADING_PROFILE = '@profile/profile/SET_IS_LOADING_PROFILE',
  SET_IS_ERROR_PROFILE = '@profile/profile/SET_IS_ERROR_PROFILE',
}

export interface IProfile {
  token: string;
  exp: number;
  createdAt: number;
  name: string;
  email: string;
  id: string;
}

export interface IProfileModule {
  data: IProfile | null;
  isLoading: boolean;
  isError: boolean;
}

export interface IProfileState {
  profile: IProfileModule;
}

export interface IProfilePayload {
  profile?: IProfile;
  isLoading?: boolean;
  isError?: boolean;
}

export type IProfileAction = {
  type: ProfileActionTypes;
  payload?: IProfilePayload;
};

export type IProfileReducer = (
  state: IProfileState,
  payload?: IProfilePayload
) => IProfileState;
