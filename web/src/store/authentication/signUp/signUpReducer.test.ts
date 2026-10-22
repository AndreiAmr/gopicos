import { describe, expect, it } from 'vitest';

import { signUpActions } from './signUpActions';
import signUpReducer from './signUpReducer';

describe('signUpReducer', () => {
  it('guarda valores parciais sem perder os anteriores', () => {
    let state = signUpReducer(undefined, signUpActions.saveSignUpValues({ firstName: 'Ana' }));
    state = signUpReducer(state, signUpActions.saveSignUpValues({ email: 'a@b.com' }));

    expect(state.signUp.values.firstName).toBe('Ana');
    expect(state.signUp.values.email).toBe('a@b.com');
  });

  it('reset apaga tudo, inclusive a senha', () => {
    let state = signUpReducer(
      undefined,
      signUpActions.saveSignUpValues({ password: 'segredo123' })
    );
    state = signUpReducer(state, signUpActions.setSignUpBannerError('erro', true));
    state = signUpReducer(state, signUpActions.resetSignUp());

    expect(state.signUp.values.password).toBe('');
    expect(state.signUp.bannerError).toBeNull();
    expect(state.signUp.canRetry).toBe(false);
  });

  it('controla loading e erro de campo', () => {
    let state = signUpReducer(undefined, signUpActions.setIsLoadingSignUp(true));
    expect(state.signUp.isLoading).toBe(true);

    state = signUpReducer(
      state,
      signUpActions.setSignUpFieldError({ field: 'email', message: 'x' })
    );
    expect(state.signUp.fieldError?.field).toBe('email');

    state = signUpReducer(state, signUpActions.setSignUpFieldError(null));
    expect(state.signUp.fieldError).toBeNull();
  });
});
