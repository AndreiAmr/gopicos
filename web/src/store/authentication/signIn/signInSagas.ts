import { call, put, takeLatest } from 'redux-saga/effects';

import { signInActions } from './signInActions';
import { signInRepository } from './signInRepository';
import { ISignInAction, SignInActionTypes } from './signInTypes';

import { navigate } from '@/routes/navigation';
import { IProfile } from '@/store/profile/profileTypes';
import { profileActions } from '@/store/profile/profileActions';
import { listSpotsActions } from '@/store/spot/modules/listSpots/listSpotsActions';
import { URL } from '@/routes/url';

export function* getSignInAsync(action: ISignInAction) {
  try {
    const payload = action.payload;
    const credentials = payload?.credentials;

    if (!credentials) {
      return;
    }

    yield put(signInActions.setIsLoadingSignIn(true));
    yield put(signInActions.setIsErrorSignIn(false));

    const profile: IProfile = yield call(
      signInRepository.getSignIn,
      credentials
    );

    yield put(profileActions.setProfile(profile));

    window.cookieStore.set('token', profile.token);

    yield put(listSpotsActions.getListSpotsAsync());

    yield call(navigate, URL.HOME);
  } catch {
    yield put(signInActions.setIsErrorSignIn(true));
  } finally {
    yield put(signInActions.setIsLoadingSignIn(false));
  }
}

const signInSagas = [
  takeLatest(SignInActionTypes.GET_SIGN_IN_ASYNC, getSignInAsync),
];

export default signInSagas;
