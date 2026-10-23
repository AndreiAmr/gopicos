import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/mapbox';

import {
  buildPointCollection,
  buildPolygonCollection,
  type SpotSummary,
} from '@/domain/spot/spot';
import { mapColors } from '../colors';
import { POLYGON_MIN_ZOOM } from './constants';

type SpotsLayersProps = {
  spots: SpotSummary[];
  selectedId: string | null;
};

const PIN_FONT = ['DIN Pro Medium', 'Arial Unicode MS Regular'];

/**
 * Pins (nota média ou "Novo") e polígonos dos picos. O pin é um símbolo de
 * texto com halo: o halo escuro desenha a borda e o claro, o fundo da pílula.
 */
export const SpotsLayers = ({ spots, selectedId }: SpotsLayersProps) => {
  const points = useMemo(
    () => buildPointCollection(spots, selectedId),
    [spots, selectedId],
  );
  const polygons = useMemo(
    () => buildPolygonCollection(spots, selectedId),
    [spots, selectedId],
  );

  return (
    <>
      <Source id="spots-polygons" type="geojson" data={polygons}>
        <Layer
          id="spots-fill"
          type="fill"
          minzoom={POLYGON_MIN_ZOOM}
          paint={{
            'fill-color': mapColors.spotStroke,
            'fill-opacity': ['case', ['get', 'selected'], 0.38, 0.22],
          }}
        />
        <Layer
          id="spots-line"
          type="line"
          minzoom={POLYGON_MIN_ZOOM}
          paint={{
            'line-color': mapColors.spotStroke,
            'line-width': ['case', ['get', 'selected'], 3, 2],
          }}
        />
      </Source>

      <Source id="spots-points" type="geojson" data={points}>
        <Layer
          id="spots-pin-border"
          type="symbol"
          filter={['!', ['get', 'selected']]}
          layout={{
            'text-field': ['get', 'label'],
            'text-font': PIN_FONT,
            'text-size': 13,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': mapColors.pinBorder,
            'text-halo-color': mapColors.pinBorder,
            'text-halo-width': 6,
          }}
        />
        <Layer
          id="spots-pin"
          type="symbol"
          filter={['!', ['get', 'selected']]}
          layout={{
            'text-field': ['get', 'label'],
            'text-font': PIN_FONT,
            'text-size': 13,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': mapColors.pinText,
            'text-halo-color': mapColors.pinSurface,
            'text-halo-width': 4.5,
          }}
        />
        <Layer
          id="spots-pin-selected-border"
          type="symbol"
          filter={['get', 'selected']}
          layout={{
            'text-field': ['get', 'label'],
            'text-font': PIN_FONT,
            'text-size': 15,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': mapColors.pinSelectedBorder,
            'text-halo-color': mapColors.pinSelectedBorder,
            'text-halo-width': 7,
          }}
        />
        <Layer
          id="spots-pin-selected"
          type="symbol"
          filter={['get', 'selected']}
          layout={{
            'text-field': ['get', 'label'],
            'text-font': PIN_FONT,
            'text-size': 15,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': mapColors.onPrimary,
            'text-halo-color': mapColors.primary,
            'text-halo-width': 5.5,
          }}
        />
      </Source>
    </>
  );
};
