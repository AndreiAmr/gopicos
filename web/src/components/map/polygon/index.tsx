import { ISpot } from '@/store/spot/spotTypes';

import { Layer, Source } from 'react-map-gl/mapbox';

type MapPolygonProps = {
  spot: ISpot;
};

export const MapPolygon = ({ spot }: MapPolygonProps) => {
  const feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: spot.coordinates,
    },
  } as const;

  return (
    <Source
      id={`location-source-${spot.id}`}
      type="geojson"
      data={{
        type: 'FeatureCollection',
        features: [feature],
      }}
    >
      <Layer
        id={`polygon-layer-${spot.id}`}
        type="fill"
        paint={{
          'fill-color': '#f9c301',
          'fill-opacity': 0.2,
        }}
      />
      <Layer
        id={`polygon-outline-${spot.id}`}
        type="line"
        paint={{
          'line-color': '#f9c301',
          'line-opacity': 1,
          'line-width': 4,
        }}
      />
    </Source>
  );
};
