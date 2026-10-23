/**
 * Estados do botão "Minha localização" (spec home.md 6.3). Lógica pura: a
 * tela traduz as ações em pedido de permissão, voo da câmera e sheets.
 */
export type LocationStatus =
  /** Permissão ainda não pedida. */
  | 'idle'
  /** Esperando a primeira posição (até 10 s). */
  | 'searching'
  /** Mapa centralizado na pessoa. */
  | 'centered'
  /** Posição conhecida, mas a pessoa moveu o mapa. */
  | 'moved'
  /** Permissão negada: o toque abre o sheet "Abrir ajustes". */
  | 'denied';

export type LocationState = {
  status: LocationStatus;
  /** Estado para onde voltar se a busca falhar. */
  previous: LocationStatus;
  position: [number, number] | null;
};

export const INITIAL_LOCATION: LocationState = {
  status: 'idle',
  previous: 'idle',
  position: null,
};

/** Tempo máximo buscando a posição antes de avisar o erro. */
export const LOCATION_TIMEOUT_MS = 10000;

export type LocationEvent =
  /** Permissão concedida (na abertura ou após pedir): começa a buscar. */
  | { type: 'granted' }
  | { type: 'denied' }
  /** Permissão revogada ou nunca pedida (ao voltar dos ajustes). */
  | { type: 'reset' }
  | { type: 'fix'; position: [number, number] }
  /** A câmera chegou na pessoa. */
  | { type: 'centered' }
  /** A pessoa arrastou ou deu zoom no mapa. */
  | { type: 'gesture' }
  /** Pedido de centralizar com a posição conhecida. */
  | { type: 'recenter' }
  /** GPS desligado ou tempo esgotado. */
  | { type: 'error' };

export const locationReducer = (
  state: LocationState,
  event: LocationEvent,
): LocationState => {
  switch (event.type) {
    case 'granted':
      if (state.status === 'centered' || state.status === 'moved') {
        return state;
      }
      return {
        ...state,
        status: 'searching',
        previous: state.status === 'denied' ? 'idle' : state.status,
      };
    case 'denied':
      return { ...state, status: 'denied', previous: 'denied' };
    case 'reset':
      return state.status === 'denied' ? { ...INITIAL_LOCATION } : state;
    case 'fix':
      return { ...state, position: event.position };
    case 'centered':
      return state.status === 'denied' || state.status === 'idle'
        ? state
        : { ...state, status: 'centered' };
    case 'gesture':
      return state.status === 'centered' ? { ...state, status: 'moved' } : state;
    case 'recenter':
      return state.position && state.status === 'moved'
        ? { ...state, status: 'centered' }
        : state;
    case 'error':
      return state.status === 'searching'
        ? { ...state, status: state.position ? 'moved' : state.previous }
        : state;
    default:
      return state;
  }
};

/** O que um toque no botão faz em cada estado. */
export type LocationAction =
  | 'request'
  | 'center'
  | 'openPermissionSheet'
  | 'none';

export const locationButtonAction = (status: LocationStatus): LocationAction => {
  switch (status) {
    case 'idle':
      return 'request';
    case 'moved':
      return 'center';
    case 'denied':
      return 'openPermissionSheet';
    default:
      return 'none';
  }
};

export const locationStrings = {
  center: 'Centralizar na minha localização',
  searching: 'Buscando sua localização',
  centered: 'Centralizado em você',
  denied: 'Localização desativada. Toque para saber como ativar',
  error: 'Não foi possível achar sua localização. Tente de novo.',
  permissionTitle: 'Ative a localização',
  permissionDescription:
    'Assim o mapa abre nos picos perto de você. Dá para ativar nos ajustes do aparelho.',
  openSettings: 'Abrir ajustes',
  notNow: 'Agora não',
} as const;

export const locationA11yLabel = (status: LocationStatus): string => {
  switch (status) {
    case 'searching':
      return locationStrings.searching;
    case 'centered':
      return locationStrings.centered;
    case 'denied':
      return locationStrings.denied;
    default:
      return locationStrings.center;
  }
};
