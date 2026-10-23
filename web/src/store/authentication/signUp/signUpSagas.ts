import { call, put, takeLatest } from 'redux-saga/effects';

import { navigate } from '@/routes/navigation';
import { URL } from '@/routes/url';

import { signUpActions } from './signUpActions';
import { classifySignUpError, STEP_URL } from './signUpErrors';
import { signUpRepository } from './signUpRepository';
import { ISignUpAction, SignUpActionTypes } from './signUpTypes';

export function* submitSignUpAsync(action: ISignUpAction) {
  const values = action.payload?.values;

  if (!values || !values.email) {
    return;
  }

  try {
    yield put(signUpActions.setIsLoadingSignUp(true));
    yield put(signUpActions.setSignUpFieldError(null));
    yield put(signUpActions.setSignUpBannerError(null));

    yield call(signUpRepository.signUp, {
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      email: values.email,
      password: values.password ?? '',
    });

    const email = values.email.trim().toLowerCase();

    yield call(navigate, URL.LOGIN, {
      replace: true,
      state: { email, accountCreated: true },
    });
    // Nada do cadastro (inclusive a senha) permanece em memoria.
    yield put(signUpActions.resetSignUp());
  } catch (error) {
    const result = classifySignUpError(error);

    if (result.kind === 'field') {
      yield put(signUpActions.setSignUpFieldError(result.error));
      yield call(navigate, STEP_URL[result.step], { replace: true });
    } else {
      yield put(
        signUpActions.setSignUpBannerError(result.message, result.canRetry)
      );
      if (result.step) {
        yield call(navigate, STEP_URL[result.step], { replace: true });
      }
    }
  } finally {
    yield put(signUpActions.setIsLoadingSignUp(false));
  }
}

const signUpSagas = [
  takeLatest(SignUpActionTypes.SUBMIT_SIGN_UP_ASYNC, submitSignUpAsync),
];

export default signUpSagas;
