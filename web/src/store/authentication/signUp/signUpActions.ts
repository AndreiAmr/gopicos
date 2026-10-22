import {
  ISignUpAction,
  ISignUpFieldError,
  ISignUpValues,
  SignUpActionTypes,
} from './signUpTypes';

const submitSignUpAsync = (values: ISignUpValues): ISignUpAction => ({
  type: SignUpActionTypes.SUBMIT_SIGN_UP_ASYNC,
  payload: { values },
});

const saveSignUpValues = (values: Partial<ISignUpValues>): ISignUpAction => ({
  type: SignUpActionTypes.SAVE_SIGN_UP_VALUES,
  payload: { values },
});

const setIsLoadingSignUp = (isLoading: boolean): ISignUpAction => ({
  type: SignUpActionTypes.SET_IS_LOADING_SIGN_UP,
  payload: { isLoading },
});

const setSignUpFieldError = (
  fieldError: ISignUpFieldError | null
): ISignUpAction => ({
  type: SignUpActionTypes.SET_SIGN_UP_FIELD_ERROR,
  payload: { fieldError },
});

const setSignUpBannerError = (
  bannerError: string | null,
  canRetry = false
): ISignUpAction => ({
  type: SignUpActionTypes.SET_SIGN_UP_BANNER_ERROR,
  payload: { bannerError, canRetry },
});

const resetSignUp = (): ISignUpAction => ({
  type: SignUpActionTypes.RESET_SIGN_UP,
});

export const signUpActions = {
  submitSignUpAsync,
  saveSignUpValues,
  setIsLoadingSignUp,
  setSignUpFieldError,
  setSignUpBannerError,
  resetSignUp,
};
