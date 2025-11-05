import { call, put, takeLatest } from 'redux-saga/effects';

import { profileActions } from './profileActions';
import { profileRepository } from './profileRepository';
import { IProfile, ProfileActionTypes } from './profileTypes';

export function* getProfileAsync() {
  try {
    yield put(profileActions.setIsLoadingProfile(true));
    yield put(profileActions.setIsErrorProfile(false));
    const profile: IProfile = yield call(
      profileRepository.getProfile,
    );

    yield put(profileActions.setProfile(profile));
  } catch  {
    yield put(profileActions.setIsErrorProfile(true));
  } finally {
    yield put(profileActions.setIsLoadingProfile(false));
  }
}

const profileSagas = [
  takeLatest(
    ProfileActionTypes.GET_PROFILE_ASYNC,
    getProfileAsync,
  ),
];

export default profileSagas;
