import Mapbox from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';

/** Registra o token no SDK; sem token não faz nada e devolve `false`. */
export const configureMapbox = (rawToken?: string): boolean => {
  const token = (rawToken ?? '').trim();
  if (!token) {
    return false;
  }
  Mapbox.setAccessToken(token);
  return true;
};

/** `false` quando o build não trouxe token: o mapa não deve ser renderizado. */
export const isMapboxConfigured = (MAPBOX_ACCESS_TOKEN ?? '').trim().length > 0;

/**
 * Chamado uma vez na inicialização do app, antes de qualquer MapView.
 * O token vem do build (react-native-dotenv).
 */
export const initMapbox = (): boolean => configureMapbox(MAPBOX_ACCESS_TOKEN);
