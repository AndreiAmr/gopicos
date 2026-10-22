import { produce } from 'immer';

import {
  SignInActionTypes,
  ISignInPayload,
  ISignInState,
  ISignInReducer,
  ISignInAction,
} from './signInTypes';

const INITIAL_STATE: ISignInState = {
  signIn: { isLoading: false, error: null },
};

const setIsLoadingSignIn: ISignInReducer = (
  state: ISignInState,
  payload?: ISignInPayload
) =>
  produce(state, (draft) => {
    draft.signIn.isLoading = payload?.isLoading || false;
  });

const setErrorSignIn: ISignInReducer = (
  state: ISignInState,
  payload?: ISignInPayload
) =>
  produce(state, (draft) => {
    draft.signIn.error = payload?.error ?? null;
  });

const signInReducerMap = new Map<SignInActionTypes, ISignInReducer>([
  [SignInActionTypes.SET_ERROR_SIGN_IN, setErrorSignIn],
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
