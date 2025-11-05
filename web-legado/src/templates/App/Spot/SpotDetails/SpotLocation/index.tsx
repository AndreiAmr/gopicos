'use client';
import { Map } from '@/atomic/atoms/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useCallback } from 'react';
import * as turf from '@turf/turf';
import MapMarker from '@/atomic/atoms/MapMarker';
import { Layer, Source } from 'react-map-gl/mapbox';

type SpotLocationProps = {
  coordinates: SpotProps['coordinates'];
  markingType: SpotProps['markingType'];
};

const SpotLocation = ({ coordinates, markingType }: SpotLocationProps) => {
  const feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: coordinates as number[][][],
    },
  } as const;

  const center =
    markingType === 'POLYGON'
      ? turf.center(feature).geometry.coordinates
      : coordinates;

  const renderPolygon = useCallback(() => {
    return (
      <React.Fragment key={JSON.stringify(coordinates) + Date.now()}>
        <MapMarker lat={center[1] as number} lng={center[0] as number}>
          <Source
            id={'location-source'}
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: [feature],
            }}
          >
            <Layer
              id={'polygon-layer'}
              type="fill"
              paint={{
                'fill-color': '#f9c301',
                'fill-opacity': 0.2,
              }}
              key="layer-key"
            />
            <Layer
              id={'polygon-outline'}
              type="line"
              paint={{
                'line-color': '#f9c301',
                'line-opacity': 1,
                'line-width': 4,
              }}
              key="outline-key"
            />
          </Source>
        </MapMarker>
      </React.Fragment>
    );
  }, [coordinates]);

  const renderPoint = useCallback(() => {
    return (
      <MapMarker
        lat={coordinates[1] as number}
        lng={coordinates[0] as number}
      />
    );
  }, [coordinates]);

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center[1]},${center[0]}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="mx-10">
      <CardHeader>
        <CardTitle>Localização</CardTitle>
      </CardHeader>

      <CardContent className="relative flex gap-2 flex-wrap h-100 rounded-md p-0 overflow-hidden mx-5">
        <Map
          zoom={17}
          initialViewState={{
            latitude: center[1] as number,
            longitude: center[0] as number,
          }}
          scrollZoom={false}
          dragPan={false}
        >
          {markingType === 'POLYGON' && renderPolygon()}
          {markingType === 'POINT' && renderPoint()}
        </Map>

        <div
          className="absolute inset-0 bg-gradient-to-t from-black to-black/10 flex items-end justify-center text-accent pb-5 font-bold cursor-pointer"
          onClick={handleNavigate}
        >
          Clique para ver rotas
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotLocation;
