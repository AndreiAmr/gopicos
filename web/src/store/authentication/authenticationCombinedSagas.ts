import signInSagas from './signIn/signInSagas';
import signUpSagas from './signUp/signUpSagas';

const authenticationCombinedSagas = [...signInSagas, ...signUpSagas];

export { authenticationCombinedSagas };
