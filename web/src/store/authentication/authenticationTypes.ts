import { ISignInState } from './signIn/signInTypes';
import { ISignUpState } from './signUp/signUpTypes';

export type AuthenticationState = {
  SignIn: ISignInState;
  SignUp: ISignUpState;
};
