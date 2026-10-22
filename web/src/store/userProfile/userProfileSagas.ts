import { call, put, takeLatest } from 'redux-saga/effects';

import { notify } from '@/lib/notify';
import { logout } from '@/utils/logout';

import { userProfileActions } from './userProfileActions';
import {
  classifyLoadError,
  classifyOperationError,
  isUnauthenticated,
} from './userProfileErrors';
import { userProfileRepository } from './userProfileRepository';
import {
  IUserProfile,
  IUserProfileAction,
  UserProfileActionTypes,
} from './userProfileTypes';

export const PROFILE_UPDATED_MESSAGE = 'Perfil atualizado.';

/** Sessão inválida: apaga o token e volta ao Login com o aviso de sessão expirada. */
export function* handleSessionExpired() {
  yield call(logout, { sessionExpired: true });
}

export function* getMeAsync() {
  try {
    yield put(userProfileActions.setIsLoadingMe(true));
    yield put(userProfileActions.setErrorMe(null));

    const me: IUserProfile = yield call(userProfileRepository.getMe);

    yield put(userProfileActions.setMe(me));
  } catch (error) {
    if (isUnauthenticated(error)) {
      yield call(handleSessionExpired);
    } else {
      yield put(userProfileActions.setErrorMe(classifyLoadError(error)));
    }
  } finally {
    yield put(userProfileActions.setIsLoadingMe(false));
  }
}

export function* updateProfileAsync(action: IUserProfileAction) {
  const input = action.payload?.input;
  if (!input) return;

  try {
    yield put(userProfileActions.setIsLoadingUpdate(true));
    yield put(userProfileActions.setErrorUpdate(null));

    const me: IUserProfile = yield call(
      userProfileRepository.updateProfile,
      input,
    );

    yield put(userProfileActions.setMe(me));
    yield call(notify.success, PROFILE_UPDATED_MESSAGE);
  } catch (error) {
    if (isUnauthenticated(error)) {
      yield call(handleSessionExpired);
    } else {
      yield put(
        userProfileActions.setErrorUpdate(
          classifyOperationError(error, {
            fields: ['firstName', 'lastName'],
          }),
        ),
      );
    }
  } finally {
    yield put(userProfileActions.setIsLoadingUpdate(false));
  }
}

const userProfileSagas = [
  takeLatest(UserProfileActionTypes.GET_ME_ASYNC, getMeAsync),
  takeLatest(UserProfileActionTypes.UPDATE_PROFILE_ASYNC, updateProfileAsync),
];

export default userProfileSagas;
