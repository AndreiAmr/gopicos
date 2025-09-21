'use client';

import { Map } from '@/atomic/atoms/Map';
import { useSidebar } from '@/components/ui/sidebar';
import React, { useEffect, useRef } from 'react';
import { Layer, Marker, Source } from 'react-map-gl/mapbox';
import * as turf from '@turf/turf';

type HomeTemplateProps = {
  spots: any[];
};

const HomeTemplate = ({ spots }: HomeTemplateProps) => {
  console.log('🚀 ~ HomeTemplate ~ spots:', spots);
  const sidebar = useSidebar();

  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.resize();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebar]);

  return (
    <div
      ref={containerRef}
      className=" max-w-screen  h-[calc(100%-80px)] w-full bg-background border border-white"
    >
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1Ijoic29uZWNhLWRldiIsImEiOiJjbTlwdXBvZHcwcHp3MnZvZ2dlemw1eGc2In0.eC8keYLoT3I6bGCEZrTZtg"
        initialViewState={{
          longitude: -46.6801928,
          latitude: -23.7642516,
          zoom: 13,
        }}
        onClick={(e) => {
          // console.log(e);
        }}
        mapStyle="mapbox://styles/soneca-dev/cm9pwu19h00l701s63khw175t"
        attributionControl={true}
        customAttribution={['Andrei Amaral']}
      >
        {spots.map((spot, index, array) => {
          if (!spot.coordinates || !spot.coordinates.length) {
            console.log('cai aqui no index', index, array.length);
            return null;
          }

          const feature = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: spot.coordinates as number[][][],
            },
          } as const;

          const center = turf.center(feature).geometry.coordinates;
          console.log('🚀 ~ center:', center);

          return (
            <React.Fragment key={spot.name + Date.now()}>
              <Source
                id={'location-source' + index}
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: [feature],
                }}
              >
                <Layer
                  id={'polygon-layer' + index}
                  type="fill"
                  paint={{
                    'fill-color': '#092178',
                    'fill-opacity': 1,
                  }}
                  key="layer-key"
                  // beforeId="water"
                />
                <Layer
                  id={'polygon-outline' + index}
                  type="line"
                  paint={{
                    'line-color': '#0b449e',
                    'line-opacity': 1,
                    'line-width': 4,
                  }}
                  key="outline-key"
                />
              </Source>
              <Source
                id={'location-point' + index}
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: center as number[],
                      },
                      properties: {},
                    },
                  ],
                }}
              >
                <Layer
                  id={'skater-layer' + index}
                  type="symbol"
                  layout={{
                    'icon-image': 'custom-skater',
                    'icon-anchor': 'center',
                    'icon-size': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      10,
                      0.3,
                      18,
                      1.5,
                    ],
                  }}
                />
              </Source>
            </React.Fragment>
          );
        })}
      </Map>
    </div>
  );
};

export default HomeTemplate;
