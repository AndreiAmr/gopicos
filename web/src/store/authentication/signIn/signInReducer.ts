import { produce } from 'immer';

import {
  SignInActionTypes,
  ISignInPayload,
  ISignInState,
  ISignInReducer,
  ISignInAction,
} from './signInTypes';

const INITIAL_STATE: ISignInState = {
  signIn: { isLoading: false, isError: false },
};

const setIsLoadingSignIn: ISignInReducer = (
  state: ISignInState,
  payload?: ISignInPayload
) =>
  produce(state, (draft) => {
    draft.signIn.isLoading = payload?.isLoading || false;
  });

const setIsErrorSignIn: ISignInReducer = (
  state: ISignInState,
  payload?: ISignInPayload
) =>
  produce(state, (draft) => {
    draft.signIn.isError = payload?.isError || false;
  });

const signInReducerMap = new Map<SignInActionTypes, ISignInReducer>([
  [SignInActionTypes.SET_IS_ERROR_SIGN_IN, setIsErrorSignIn],
  [SignInActionTypes.SET_IS_LOADING_SIGN_IN, setIsLoadingSignIn],
]);

const signInReducer = (
  state: ISignInState = INITIAL_STATE,
  action = {} as ISignInAction
): ISignInState => {
  const reducer = signInReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default signInReducer;
