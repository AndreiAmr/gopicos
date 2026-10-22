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
  SpotDetails: { id: string };
  /** Criar pico, passo 1: marcar o local. */
  NewSpotLocation: undefined;
  /** Criar pico, passo 2: polígono GeoJSON fechado em [lng, lat]. */
  NewSpotDetails: {
    coordinates: { type: 'Polygon'; coordinates: number[][][] };
  };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ProfileEdit: undefined;
};
