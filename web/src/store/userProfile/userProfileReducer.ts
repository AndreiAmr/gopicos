import { produce } from 'immer';

import {
  IUserProfileAction,
  IUserProfilePayload,
  IUserProfileReducer,
  IUserProfileState,
  UserProfileActionTypes,
} from './userProfileTypes';

export const USER_PROFILE_INITIAL_STATE: IUserProfileState = {
  me: { data: null, isLoading: false, error: null },
  update: { isLoading: false, error: null },
  changePassword: { isLoading: false, error: null, success: false },
};

const setMe: IUserProfileReducer = (state, payload?: IUserProfilePayload) =>
  produce(state, (draft) => {
    draft.me.data = payload?.me ?? null;
  });

const setIsLoadingMe: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.me.isLoading = payload?.isLoading ?? false;
  });

const setErrorMe: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.me.error = payload?.loadError ?? null;
  });

const setIsLoadingUpdate: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.update.isLoading = payload?.isLoading ?? false;
  });

const setErrorUpdate: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.update.error = payload?.operationError ?? null;
  });

const setIsLoadingPassword: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.changePassword.isLoading = payload?.isLoading ?? false;
  });

const setErrorPassword: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.changePassword.error = payload?.operationError ?? null;
  });

const setSuccessPassword: IUserProfileReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.changePassword.success = payload?.success ?? false;
  });

const reducerMap = new Map<UserProfileActionTypes, IUserProfileReducer>([
  [UserProfileActionTypes.SET_ME, setMe],
  [UserProfileActionTypes.SET_IS_LOADING_ME, setIsLoadingMe],
  [UserProfileActionTypes.SET_ERROR_ME, setErrorMe],
  [UserProfileActionTypes.SET_IS_LOADING_UPDATE, setIsLoadingUpdate],
  [UserProfileActionTypes.SET_ERROR_UPDATE, setErrorUpdate],
  [UserProfileActionTypes.SET_IS_LOADING_PASSWORD, setIsLoadingPassword],
  [UserProfileActionTypes.SET_ERROR_PASSWORD, setErrorPassword],
  [UserProfileActionTypes.SET_SUCCESS_PASSWORD, setSuccessPassword],
]);

const userProfileReducer = (
  state: IUserProfileState = USER_PROFILE_INITIAL_STATE,
  action = {} as IUserProfileAction,
): IUserProfileState => {
  const reducer = reducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default userProfileReducer;
