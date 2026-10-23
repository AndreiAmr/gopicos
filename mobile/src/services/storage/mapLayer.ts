import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_MAP_LAYER,
  MapLayer,
  parseStoredLayer,
} from '../../domain/map/layers';

/** Chave da camada escolhida no aparelho (decisão do dono P4, spec home.md 14). */
export const MAP_LAYER_STORAGE_KEY = '@gopicos/map-layer';

/** Lê a camada salva; sem valor ou com erro de leitura, Rua. */
export const loadMapLayer = async (): Promise<MapLayer> => {
  try {
    return parseStoredLayer(await AsyncStorage.getItem(MAP_LAYER_STORAGE_KEY));
  } catch {
    return DEFAULT_MAP_LAYER;
  }
};

/** Salva a camada; falha de escrita não impede a troca (só não persiste). */
export const saveMapLayer = async (layer: MapLayer): Promise<void> => {
  try {
    await AsyncStorage.setItem(MAP_LAYER_STORAGE_KEY, layer);
  } catch {
    // sem persistência: a camada vale até o app fechar
  }
};
