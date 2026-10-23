import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_MAP_LAYER,
  MapLayer,
  layerStrings,
  mapStyleFor,
} from '../../../domain/map/layers';
import { loadMapLayer, saveMapLayer } from '../../../services/storage/mapLayer';

type Options = {
  /** Erro ao carregar a camada (a anterior volta). */
  onError: (message: string) => void;
};

/**
 * Camada do mapa (GP-048): começa com a salva no aparelho, troca na hora e
 * persiste (decisão do dono P4). Se o estilo novo falhar (ex.: satélite sem
 * rede), volta para a anterior.
 */
export const useMapLayer = ({ onError }: Options) => {
  const [layer, setLayerState] = useState<MapLayer>(DEFAULT_MAP_LAYER);
  const [ready, setReady] = useState(false);
  /** Trocando de estilo (só quando a URL muda; Rua/Concreto é só config). */
  const [switching, setSwitching] = useState(false);
  const previous = useRef<MapLayer>(DEFAULT_MAP_LAYER);

  useEffect(() => {
    let mounted = true;
    loadMapLayer().then(saved => {
      if (!mounted) return;
      setLayerState(saved);
      previous.current = saved;
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setLayer = useCallback(
    (next: MapLayer) => {
      if (next === layer) return;
      previous.current = layer;
      const changesStyle =
        mapStyleFor(next, 'light').styleURL !== mapStyleFor(layer, 'light').styleURL;
      setSwitching(changesStyle);
      setLayerState(next);
      saveMapLayer(next);
    },
    [layer],
  );

  const onStyleLoaded = useCallback(() => setSwitching(false), []);

  const onStyleError = useCallback(() => {
    if (!switching) return;
    const failed = layer;
    const back = previous.current;
    setSwitching(false);
    setLayerState(back);
    saveMapLayer(back);
    onError(
      failed === 'satellite' ? layerStrings.satelliteError : layerStrings.styleError,
    );
  }, [layer, onError, switching]);

  return { layer, ready, switching, setLayer, onStyleLoaded, onStyleError };
};
