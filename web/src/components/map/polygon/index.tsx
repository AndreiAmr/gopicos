import { ISpot } from '@/store/spot/spotTypes';
import React from 'react';
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
    <React.Fragment key={spot.name + Date.now()}>
      {/* <MapMarker lat={center[1]} lng={center[0]} spot={spot}> */}
      <Source
        id={'location-source' + spot.name}
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: [feature],
        }}
      >
        <Layer
          id={'polygon-layer' + spot.name}
          type="fill"
          paint={{
            'fill-color': '#f9c301',
            'fill-opacity': 0.2,
          }}
          key="layer-key"
        />
        <Layer
          id={'polygon-outline' + spot.name}
          type="line"
          paint={{
            'line-color': '#f9c301',
            'line-opacity': 1,
            'line-width': 4,
          }}
          key="outline-key"
        />
      </Source>
      {/* </MapMarker> */}
    </React.Fragment>
  );
};
