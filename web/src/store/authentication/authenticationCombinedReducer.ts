import { combineReducers } from 'redux';
import signInReducer from './signIn/signInReducer';
import signUpReducer from './signUp/signUpReducer';

const authenticationCombinedReducer = combineReducers({
  SignIn: signInReducer,
  SignUp: signUpReducer,
});

export { authenticationCombinedReducer };
