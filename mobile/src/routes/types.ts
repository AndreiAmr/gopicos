export type RootStackParamList = {
  Login:
    | {
        email?: string;
        notice?: 'registered' | 'passwordChanged' | 'sessionExpired';
      }
    | undefined;
  Signup: undefined;
  Home: undefined;
};
