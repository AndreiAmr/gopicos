import { useCallback, useEffect, useReducer, useRef } from 'react';
import { AppState } from 'react-native';
import {
  INITIAL_LOCATION,
  LOCATION_TIMEOUT_MS,
  locationButtonAction,
  locationReducer,
} from '../../../domain/map/location';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '../../../services/location/permission';

type Options = {
  /** Leva a câmera até a pessoa. */
  onCenter: (position: [number, number]) => void;
  /** GPS desligado ou tempo esgotado numa busca pedida pela pessoa. */
  onError: () => void;
  /** Permissão negada: abre o sheet "Ative a localização". */
  onOpenPermissionSheet: () => void;
  onPosition?: (position: [number, number]) => void;
};

/** Botão "Minha localização" (spec home.md 6.3) ligado à permissão do sistema. */
export const useLocationControl = ({
  onCenter,
  onError,
  onOpenPermissionSheet,
  onPosition,
}: Options) => {
  const [state, dispatch] = useReducer(locationReducer, INITIAL_LOCATION);
  const statusRef = useRef(state.status);
  statusRef.current = state.status;
  const userInitiated = useRef(false);

  const syncPermission = useCallback(async () => {
    const permission = await checkLocationPermission();
    if (permission === 'granted') {
      dispatch({ type: 'granted' });
    } else if (permission === 'denied') {
      dispatch({ type: 'denied' });
    } else {
      dispatch({ type: 'reset' });
    }
  }, []);

  // Com permissão já concedida, o mapa abre na pessoa.
  useEffect(() => {
    syncPermission();
  }, [syncPermission]);

  // Voltando dos ajustes do aparelho, relê a permissão.
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (next === 'active' && statusRef.current === 'denied') {
        syncPermission();
      }
    });
    return () => sub.remove();
  }, [syncPermission]);

  // Buscando por até 10 s; depois, erro e volta ao estado anterior.
  useEffect(() => {
    if (state.status !== 'searching') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'error' });
      if (userInitiated.current) {
        onError();
      }
    }, LOCATION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [state.status, onError]);

  const onFix = useCallback(
    (position: [number, number]) => {
      dispatch({ type: 'fix', position });
      onPosition?.(position);
      if (statusRef.current === 'searching') {
        onCenter(position);
        dispatch({ type: 'centered' });
      }
    },
    [onCenter, onPosition],
  );

  const onGesture = useCallback(() => dispatch({ type: 'gesture' }), []);

  const press = useCallback(async () => {
    const action = locationButtonAction(state.status);
    if (action === 'request') {
      userInitiated.current = true;
      const permission = await requestLocationPermission();
      if (permission === 'granted') {
        dispatch({ type: 'granted' });
      } else if (permission === 'denied') {
        dispatch({ type: 'denied' });
        onOpenPermissionSheet();
      } else {
        onError();
      }
    } else if (action === 'center' && state.position) {
      onCenter(state.position);
      dispatch({ type: 'recenter' });
    } else if (action === 'openPermissionSheet') {
      onOpenPermissionSheet();
    }
  }, [state.status, state.position, onCenter, onError, onOpenPermissionSheet]);

  const showUserLocation =
    state.status === 'searching' ||
    state.status === 'centered' ||
    state.status === 'moved';

  return {
    status: state.status,
    position: state.position,
    showUserLocation,
    onFix,
    onGesture,
    press,
  };
};
