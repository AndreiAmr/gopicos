import { call, put, takeLatest } from 'redux-saga/effects';

import { signInActions } from './signInActions';
import { classifySignInError } from './signInErrors';
import { signInRepository } from './signInRepository';
import { ISignInAction, SignInActionTypes } from './signInTypes';

import { navigate, sanitizeRedirect } from '@/routes/navigation';
import { IProfile } from '@/store/profile/profileTypes';
import { profileActions } from '@/store/profile/profileActions';
import { listSpotsActions } from '@/store/spot/modules/listSpots/listSpotsActions';
import { URL } from '@/routes/url';
import { notify } from '@/lib/notify';
import { saveSession } from '@/utils/session';

export const REACTIVATED_MESSAGE = 'Bem-vindo de volta! Sua conta foi reativada.';

export function* getSignInAsync(action: ISignInAction) {
  try {
    const payload = action.payload;
    const credentials = payload?.credentials;

    if (!credentials) {
      return;
    }

    yield put(signInActions.setIsLoadingSignIn(true));
    yield put(signInActions.setErrorSignIn(null));

    const profile: IProfile = yield call(
      signInRepository.getSignIn,
      credentials
    );

    yield call(saveSession, { token: profile.token, exp: profile.exp });
    yield put(profileActions.setProfile(profile));
    yield put(listSpotsActions.getListSpotsAsync());

    if (profile.reactivated) {
      yield call(notify.success, REACTIVATED_MESSAGE);
    }

    const destination = sanitizeRedirect(payload?.redirectTo) ?? URL.HOME;
    yield call(navigate, destination, { replace: true });
  } catch (error) {
    yield put(signInActions.setErrorSignIn(classifySignInError(error)));
  } finally {
    yield put(signInActions.setIsLoadingSignIn(false));
  }
}

const signInSagas = [
  takeLatest(SignInActionTypes.GET_SIGN_IN_ASYNC, getSignInAsync),
];

export default signInSagas;
