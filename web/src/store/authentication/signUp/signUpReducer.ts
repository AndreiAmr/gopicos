import { produce } from 'immer';

import {
  ISignUpAction,
  ISignUpModule,
  ISignUpReducer,
  ISignUpState,
  SignUpActionTypes,
} from './signUpTypes';

const buildInitialModule = (): ISignUpModule => ({
  values: {
    firstName: '',
    lastName: '',
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
  },
  isLoading: false,
  fieldError: null,
  bannerError: null,
  canRetry: false,
});

const INITIAL_STATE: ISignUpState = { signUp: buildInitialModule() };

const saveSignUpValues: ISignUpReducer = (state, payload) =>
  produce(state, (draft) => {
    Object.assign(draft.signUp.values, payload?.values);
  });

const setIsLoadingSignUp: ISignUpReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.signUp.isLoading = payload?.isLoading || false;
  });

const setSignUpFieldError: ISignUpReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.signUp.fieldError = payload?.fieldError ?? null;
  });

const setSignUpBannerError: ISignUpReducer = (state, payload) =>
  produce(state, (draft) => {
    draft.signUp.bannerError = payload?.bannerError ?? null;
    draft.signUp.canRetry = payload?.canRetry ?? false;
  });

const resetSignUp: ISignUpReducer = () => ({ signUp: buildInitialModule() });

const signUpReducerMap = new Map<SignUpActionTypes, ISignUpReducer>([
  [SignUpActionTypes.SAVE_SIGN_UP_VALUES, saveSignUpValues],
  [SignUpActionTypes.SET_IS_LOADING_SIGN_UP, setIsLoadingSignUp],
  [SignUpActionTypes.SET_SIGN_UP_FIELD_ERROR, setSignUpFieldError],
  [SignUpActionTypes.SET_SIGN_UP_BANNER_ERROR, setSignUpBannerError],
  [SignUpActionTypes.RESET_SIGN_UP, resetSignUp],
]);

const signUpReducer = (
  state: ISignUpState = INITIAL_STATE,
  action = {} as ISignUpAction
): ISignUpState => {
  const reducer = signUpReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default signUpReducer;
