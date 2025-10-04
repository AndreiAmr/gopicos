import { Map } from '@/atomic/atoms/Map';
import { Layer, Source } from 'react-map-gl/mapbox';
import { useNewSpotMap } from './useNewSpotMap';
import { getBoundingBoxPolygonVertices } from '@/utils/geocoding';

export const NewSpotMap = () => {
  const { coordinates, handleMapClick, lat, lng, boundingBox, markingType } =
    useNewSpotMap();

  const feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',

      coordinates: coordinates ? (coordinates as number[][][]) : [],
    },
  } as const;

  const areaFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',

      coordinates: boundingBox
        ? [getBoundingBoxPolygonVertices(boundingBox)]
        : [],
    },
  } as const;

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden ">
      <Map
        lat={lat}
        lon={lng}
        onClick={(e) =>
          handleMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        }
      >
        {markingType === 'POLYGON' && (
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
                'fill-color': '#092178',

                'fill-opacity': 0.5,
              }}
              key="layer-key"
              // beforeId="water"
            />
            <Layer
              id={'polygon-outline'}
              type="line"
              paint={{
                'line-color': '#000000',
                'line-opacity': 1,
                'line-width': 4,
              }}
              key="outline-key"
            />
          </Source>
        )}
        <Source
          id={'area-polygon-source'}
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: [areaFeature],
          }}
        >
          <Layer
            id={'polygon-layer2'}
            type="fill"
            paint={{
              'fill-color': '#FFFFFF',

              'fill-opacity': 0.3,
            }}
            // key="layer-key"
            // beforeId="water"
          />
          <Layer
            id={'polygon-outline3'}
            type="line"
            paint={{
              'line-color': '#000000',
              'line-opacity': 1,
              'line-width': 4,
            }}
            // key="outline-key"
          />
        </Source>

        {markingType === 'POINT' && (
          <Source
            id={'location-point'}
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: coordinates as number[],
                  },
                  properties: {},
                },
              ],
            }}
          >
            <Layer
              id={'skater-layer'}
              type="symbol"
              layout={{
                'icon-image': 'custom-skater',
                'icon-anchor': 'bottom',
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
        )}
      </Map>
    </div>
  );
};
