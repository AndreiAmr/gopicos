import { call, put, select, takeLatest } from 'redux-saga/effects';

import { notify } from '@/lib/notify';
import { logout } from '@/utils/logout';

import { userProfileActions } from './userProfileActions';
import {
  classifyLoadError,
  classifyOperationError,
  isUnauthenticated,
} from './userProfileErrors';
import { userProfileRepository } from './userProfileRepository';
import { userProfileSelectors } from './userProfileSelectors';
import {
  IUserProfile,
  IUserProfileAction,
  UserProfileActionTypes,
} from './userProfileTypes';

export const PROFILE_UPDATED_MESSAGE = 'Perfil atualizado.';
export const PASSWORD_CHANGED_MESSAGE = 'Senha alterada.';
export const WRONG_PASSWORD_MESSAGE = 'Senha incorreta.';
export const WRONG_CURRENT_PASSWORD_MESSAGE = 'Senha atual incorreta.';

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

/** Troca de senha: a sessão atual continua válida (D33), nada é limpo além do formulário. */
export function* changePasswordAsync(action: IUserProfileAction) {
  const input = action.payload?.passwordInput;
  if (!input) return;

  try {
    yield put(userProfileActions.setIsLoadingPassword(true));
    yield put(userProfileActions.setErrorPassword(null));
    yield put(userProfileActions.setSuccessPassword(false));

    yield call(userProfileRepository.changePassword, input);

    yield put(userProfileActions.setSuccessPassword(true));
    yield call(notify.success, PASSWORD_CHANGED_MESSAGE);
  } catch (error) {
    if (isUnauthenticated(error)) {
      yield call(handleSessionExpired);
    } else {
      yield put(
        userProfileActions.setErrorPassword(
          classifyOperationError(error, {
            fields: ['newPassword', 'currentPassword'],
            invalidCredentials: {
              field: 'currentPassword',
              message: WRONG_CURRENT_PASSWORD_MESSAGE,
            },
          }),
        ),
      );
    }
  } finally {
    yield put(userProfileActions.setIsLoadingPassword(false));
  }
}

/**
 * Excluir conta = desativar (D4). Sucesso: apaga sessão e estado e vai ao Login
 * com o aviso e o e-mail preenchido (D34). Erro: nada é apagado localmente.
 */
export function* deleteAccountAsync(action: IUserProfileAction) {
  const password = action.payload?.password;
  if (!password) return;

  try {
    yield put(userProfileActions.setIsLoadingDelete(true));
    yield put(userProfileActions.setErrorDelete(null));

    const me: IUserProfile | null = yield select(userProfileSelectors.getMe);

    yield call(userProfileRepository.deleteAccount, password);

    yield call(logout, { accountDeleted: true, email: me?.email });
  } catch (error) {
    if (isUnauthenticated(error)) {
      yield call(handleSessionExpired);
    } else {
      yield put(
        userProfileActions.setErrorDelete(
          classifyOperationError(error, {
            fields: ['password'],
            invalidCredentials: {
              field: 'password',
              message: WRONG_PASSWORD_MESSAGE,
            },
          }),
        ),
      );
    }
  } finally {
    yield put(userProfileActions.setIsLoadingDelete(false));
  }
}

const userProfileSagas = [
  takeLatest(UserProfileActionTypes.GET_ME_ASYNC, getMeAsync),
  takeLatest(UserProfileActionTypes.UPDATE_PROFILE_ASYNC, updateProfileAsync),
  takeLatest(UserProfileActionTypes.CHANGE_PASSWORD_ASYNC, changePasswordAsync),
  takeLatest(UserProfileActionTypes.DELETE_ACCOUNT_ASYNC, deleteAccountAsync),
];

export default userProfileSagas;
