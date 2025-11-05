import { produce } from 'immer';

import {
  ProfileActionTypes,
  IProfilePayload,
  IProfileState,
  IProfileReducer,
  IProfileAction,
} from './profileTypes';

const INITIAL_STATE: IProfileState = {
  profile: { data: null, isLoading: false, isError: false },
};

const setProfile: IProfileReducer = (
  state: IProfileState,
  payload?: IProfilePayload
) =>
  produce(state, (draft) => {
    draft.profile.data = payload?.profile || null;
  });

const profileReducerMap = new Map<ProfileActionTypes, IProfileReducer>([
  [ProfileActionTypes.SET_PROFILE, setProfile],
]);

const profileReducer = (
  state: IProfileState = INITIAL_STATE,
  action = {} as IProfileAction
): IProfileState => {
  const reducer = profileReducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);

  return state;
};

export default profileReducer;
