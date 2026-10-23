import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo } from 'react';
import bbox from '@turf/bbox';
import Mapbox, { Layer, Source } from 'react-map-gl/mapbox';
import type { LngLatBoundsLike } from 'react-map-gl/mapbox';

import { buildPolygonCollection, polygonRing } from '@/domain/spot/spot';
import type { SpotCoordinates } from '@/domain/spot/spot';
import { mapColors } from '@/components/map/colors';
import { cn } from '@/lib/utils';

type MiniMapProps = {
  coordinates: SpotCoordinates;
  name: string;
  className?: string;
};

/** Mini-mapa estático (408x180 por padrão) com o polígono do pico enquadrado. */
export const MiniMap = ({ coordinates, name, className }: MiniMapProps) => {
  const data = useMemo(
    () =>
      polygonRing(coordinates)
        ? buildPolygonCollection(
            [
              {
                id: 'spot',
                name,
                modality: '',
                coordinates,
                ratingAverage: null,
                reviewsCount: 0,
              },
            ],
            null,
          )
        : null,
    [coordinates, name],
  );

  if (!data) return null;

  return (
    <div
      className={cn(
        'h-45 w-full overflow-hidden rounded-lg border border-gp-divider',
        className,
      )}
      role="img"
      aria-label={`Mapa com a área de ${name}`}
    >
      <Mapbox
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/soneca-dev/cm9pwp2hq00jg01rw9k3u8ape"
        initialViewState={{
          bounds: bbox(data) as LngLatBoundsLike,
          fitBoundsOptions: { padding: 32, maxZoom: 18 },
        }}
        interactive={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <Source id="mini-spot" type="geojson" data={data}>
          <Layer
            id="mini-spot-fill"
            type="fill"
            paint={{ 'fill-color': mapColors.spotStroke, 'fill-opacity': 0.3 }}
          />
          <Layer
            id="mini-spot-line"
            type="line"
            paint={{ 'line-color': mapColors.spotStroke, 'line-width': 3 }}
          />
        </Source>
      </Mapbox>
    </div>
  );
};
