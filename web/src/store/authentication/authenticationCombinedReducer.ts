import { combineReducers } from 'redux';
import signInReducer from './signIn/signInReducer';

const authenticationCombinedReducer = combineReducers({
  SignIn: signInReducer,
});

export { authenticationCombinedReducer };
