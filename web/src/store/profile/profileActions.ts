import { IProfile, ProfileActionTypes, IProfileAction } from './profileTypes';

const setProfile = (profile: IProfile): IProfileAction => ({
  payload: { profile },
  type: ProfileActionTypes.SET_PROFILE,
});

export const profileActions = {
  setProfile,
};
