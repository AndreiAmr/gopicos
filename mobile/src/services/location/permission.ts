import { Linking, Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';

/** Resultado simplificado da permissão de localização "durante o uso". */
export type LocationPermission = 'granted' | 'undetermined' | 'denied' | 'unavailable';

const PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const fromCheck = (result: string): LocationPermission => {
  switch (result) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED:
      return 'granted';
    case RESULTS.DENIED:
      // Em `check`, DENIED quer dizer "ainda pode pedir".
      return 'undetermined';
    case RESULTS.BLOCKED:
      return 'denied';
    default:
      return 'unavailable';
  }
};

/** Consulta sem perguntar nada à pessoa. */
export const checkLocationPermission = async (): Promise<LocationPermission> => {
  try {
    return fromCheck(await check(PERMISSION));
  } catch {
    return 'unavailable';
  }
};

/** Mostra o diálogo do sistema (exceção D39); recusar vira `denied`. */
export const requestLocationPermission = async (): Promise<LocationPermission> => {
  try {
    const result = await request(PERMISSION);
    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) return 'granted';
    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) return 'denied';
    return 'unavailable';
  } catch {
    return 'unavailable';
  }
};

/** "Abrir ajustes" do sheet de permissão. */
export const openAppSettings = () => Linking.openSettings().catch(() => undefined);
