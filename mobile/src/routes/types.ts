export type RootStackParamList = {
  Login:
    | {
        /** E-mail para preencher (vindo do cadastro / recuperação de senha). */
        email?: string;
        /** Banner de contexto exibido acima do formulário. */
        notice?:
          | 'registered'
          | 'passwordChanged'
          | 'sessionExpired'
          | 'accountDeleted';
      }
    | undefined;
  Signup: undefined;
  Home: undefined;
  SpotDetails: { id: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ProfileEdit: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  MySpots: undefined;
  MyReviews: undefined;
};
