'use client';

import React, { useCallback } from 'react';
import { Map } from '@/atomic/atoms/Map';

import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
} from 'react-map-gl/mapbox';
import * as turf from '@turf/turf';

import MapMarker from '@/atomic/atoms/MapMarker';
import { useHomeTemplate } from './useHomeTemplate';

type HomeTemplateProps = {
  spots: SpotProps[];
};

const HomeTemplate = ({ spots }: HomeTemplateProps) => {
  const { mapRef } = useHomeTemplate({});

  const renderPolygon = useCallback((spot: SpotProps) => {
    const feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: spot.coordinates as number[][][],
      },
    } as const;

    const center = turf.center(feature).geometry.coordinates;

    return (
      <React.Fragment key={spot.name + Date.now()}>
        <MapMarker lat={center[1]} lng={center[0]} spot={spot}>
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
        </MapMarker>
      </React.Fragment>
    );
  }, []);

  const renderPoint = useCallback((spot: SpotProps) => {
    return (
      <MapMarker
        lat={spot.coordinates[1] as number}
        lng={spot.coordinates[0] as number}
        spot={spot}
      />
    );
  }, []);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1Ijoic29uZWNhLWRldiIsImEiOiJjbTlwdXBvZHcwcHp3MnZvZ2dlemw1eGc2In0.eC8keYLoT3I6bGCEZrTZtg"
      initialViewState={{
        longitude: -46.6801928,
        latitude: -23.7642516,
        zoom: 13,
      }}
      // mapStyle="mapbox://styles/soneca-dev/cm9pwu19h00l701s63khw175t"
    >
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl />
      <FullscreenControl position="top-left" />

      {spots.map((spot) => {
        if (!spot.coordinates || !spot.coordinates.length) {
          return null;
        }

        console.log('🚀 ~ spot.markingType:', spot.markingType);
        if (spot.markingType === 'POLYGON') {
          return renderPolygon(spot);
        }

        if (spot.markingType === 'POINT') {
          return renderPoint(spot);
        }
      })}
    </Map>
    // </div>
  );
};

export default HomeTemplate;
