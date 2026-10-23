import {
  IChangePasswordInput,
  IUpdateProfileInput,
  IUserProfile,
  IUserProfileAction,
  UserProfileActionTypes,
  UserProfileLoadError,
  UserProfileOperationError,
} from './userProfileTypes';

const getMeAsync = (): IUserProfileAction => ({
  type: UserProfileActionTypes.GET_ME_ASYNC,
});

const setMe = (me: IUserProfile | null): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_ME,
  payload: { me },
});

const setIsLoadingMe = (isLoading: boolean): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_IS_LOADING_ME,
  payload: { isLoading },
});

const setErrorMe = (loadError: UserProfileLoadError | null): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_ERROR_ME,
  payload: { loadError },
});

const updateProfileAsync = (input: IUpdateProfileInput): IUserProfileAction => ({
  type: UserProfileActionTypes.UPDATE_PROFILE_ASYNC,
  payload: { input },
});

const setIsLoadingUpdate = (isLoading: boolean): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_IS_LOADING_UPDATE,
  payload: { isLoading },
});

const setErrorUpdate = (
  operationError: UserProfileOperationError | null,
): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_ERROR_UPDATE,
  payload: { operationError },
});

const changePasswordAsync = (
  passwordInput: IChangePasswordInput,
): IUserProfileAction => ({
  type: UserProfileActionTypes.CHANGE_PASSWORD_ASYNC,
  payload: { passwordInput },
});

const setIsLoadingPassword = (isLoading: boolean): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_IS_LOADING_PASSWORD,
  payload: { isLoading },
});

const setErrorPassword = (
  operationError: UserProfileOperationError | null,
): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_ERROR_PASSWORD,
  payload: { operationError },
});

const setSuccessPassword = (success: boolean): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_SUCCESS_PASSWORD,
  payload: { success },
});

const deleteAccountAsync = (password: string): IUserProfileAction => ({
  type: UserProfileActionTypes.DELETE_ACCOUNT_ASYNC,
  payload: { password },
});

const setIsLoadingDelete = (isLoading: boolean): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_IS_LOADING_DELETE,
  payload: { isLoading },
});

const setErrorDelete = (
  operationError: UserProfileOperationError | null,
): IUserProfileAction => ({
  type: UserProfileActionTypes.SET_ERROR_DELETE,
  payload: { operationError },
});

export const userProfileActions = {
  getMeAsync,
  setMe,
  setIsLoadingMe,
  setErrorMe,
  updateProfileAsync,
  setIsLoadingUpdate,
  setErrorUpdate,
  changePasswordAsync,
  setIsLoadingPassword,
  setErrorPassword,
  setSuccessPassword,
  deleteAccountAsync,
  setIsLoadingDelete,
  setErrorDelete,
};
