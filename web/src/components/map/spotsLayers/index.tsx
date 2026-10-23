import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/mapbox';
import type { SymbolLayerSpecification } from 'mapbox-gl';

import {
  buildPointCollection,
  buildPolygonCollection,
  type SpotSummary,
} from '@/domain/spot/spot';
import { mapColors } from '../colors';
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
  POLYGON_MIN_ZOOM,
} from './constants';

type SpotsLayersProps = {
  spots: SpotSummary[];
  selectedId: string | null;
};

const PIN_FONT = ['DIN Pro Medium', 'Arial Unicode MS Regular'];
const CLUSTER_FONT = ['DIN Pro Bold', 'Arial Unicode MS Bold'];

const pinLayout = (size: number): SymbolLayerSpecification['layout'] => ({
  'text-field': ['get', 'label'],
  'text-font': PIN_FONT,
  'text-size': size,
  'text-allow-overlap': true,
});

/**
 * Pins (nota média ou "Novo") e polígonos dos picos. O pin é um símbolo de
 * texto com halo: o halo escuro desenha a borda e o claro, o fundo da pílula.
 */
export const SpotsLayers = ({ spots, selectedId }: SpotsLayersProps) => {
  // O pico selecionado nunca entra em cluster: fica numa fonte própria.
  const points = useMemo(
    () =>
      buildPointCollection(
        spots.filter((spot) => spot.id !== selectedId),
        null,
      ),
    [spots, selectedId],
  );
  const selectedPoint = useMemo(
    () =>
      buildPointCollection(
        spots.filter((spot) => spot.id === selectedId),
        selectedId,
      ),
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

      <Source
        id="spots-points"
        type="geojson"
        data={points}
        cluster
        clusterRadius={CLUSTER_RADIUS}
        clusterMaxZoom={CLUSTER_MAX_ZOOM}
      >
        {/* Cluster: círculo com a contagem (sem nota: média de picos diferentes enganaria). */}
        <Layer
          id="spots-clusters"
          type="circle"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': mapColors.primary,
            'circle-stroke-color': mapColors.clusterStroke,
            'circle-stroke-width': 2,
            'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 50, 26],
          }}
        />
        <Layer
          id="spots-cluster-count"
          type="symbol"
          filter={['has', 'point_count']}
          layout={{
            'text-field': [
              'case',
              ['>', ['get', 'point_count'], 99],
              '99+',
              ['to-string', ['get', 'point_count']],
            ],
            'text-font': CLUSTER_FONT,
            'text-size': 14,
            'text-allow-overlap': true,
          }}
          paint={{ 'text-color': mapColors.onPrimary }}
        />
        <Layer
          id="spots-pin-border"
          type="symbol"
          filter={['!', ['has', 'point_count']]}
          layout={pinLayout(13)}
          paint={{
            'text-color': mapColors.pinBorder,
            'text-halo-color': mapColors.pinBorder,
            'text-halo-width': 6,
          }}
        />
        <Layer
          id="spots-pin"
          type="symbol"
          filter={['!', ['has', 'point_count']]}
          layout={pinLayout(13)}
          paint={{
            'text-color': mapColors.pinText,
            'text-halo-color': mapColors.pinSurface,
            'text-halo-width': 4.5,
          }}
        />
      </Source>

      <Source id="spots-selected" type="geojson" data={selectedPoint}>
        <Layer
          id="spots-pin-selected-border"
          type="symbol"
          layout={pinLayout(15)}
          paint={{
            'text-color': mapColors.pinSelectedBorder,
            'text-halo-color': mapColors.pinSelectedBorder,
            'text-halo-width': 7,
          }}
        />
        <Layer
          id="spots-pin-selected"
          type="symbol"
          layout={pinLayout(15)}
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
