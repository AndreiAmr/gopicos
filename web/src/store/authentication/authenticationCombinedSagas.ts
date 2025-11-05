import signInSagas from './signIn/signInSagas';

const authenticationCombinedSagas = [...signInSagas];

export { authenticationCombinedSagas };
