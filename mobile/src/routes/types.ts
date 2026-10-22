export type RootStackParamList = {
  Login:
    | {
        /** E-mail para preencher (vindo do cadastro / recuperação de senha). */
        email?: string;
        /** Banner de contexto exibido acima do formulário. */
        notice?: 'registered' | 'passwordChanged' | 'sessionExpired';
      }
    | undefined;
  Signup: undefined;
  Home: undefined;
};
