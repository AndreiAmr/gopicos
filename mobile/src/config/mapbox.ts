import Mapbox from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';

/** Token público do Mapbox embutido no build (react-native-dotenv). */
const token = (MAPBOX_ACCESS_TOKEN ?? '').trim();

/** `false` quando o build não trouxe token: o mapa não deve ser renderizado. */
export const isMapboxConfigured = token.length > 0;

/**
 * Registra o token no SDK. Chamado uma vez na inicialização do app, antes de
 * qualquer MapView. Sem token não faz nada (o app não quebra).
 */
export const initMapbox = (): boolean => {
  if (!isMapboxConfigured) {
    return false;
  }
  Mapbox.setAccessToken(token);
  return true;
};
