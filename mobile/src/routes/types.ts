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
  /** Criar pico, passo 1: marcar o local. */
  NewSpotLocation: undefined;
  /** Criar pico, passo 2: polígono GeoJSON fechado em [lng, lat]. */
  NewSpotDetails: {
    coordinates: { type: 'Polygon'; coordinates: number[][][] };
  };
  /** Editar pico: `coordinates` traz o local alterado em "Alterar local". */
  EditSpot: {
    id: string;
    coordinates?: { type: 'Polygon'; coordinates: number[][][] };
  };
  /** Alterar local do pico em edição (polígono atual, vértices arrastáveis). */
  EditSpotLocation: {
    id: string;
    coordinates: { type: 'Polygon'; coordinates: number[][][] };
  };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ProfileEdit: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  MySpots: undefined;
  MyReviews: undefined;
};
