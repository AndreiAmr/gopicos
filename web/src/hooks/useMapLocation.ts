import { PlaceSearchValues } from '@/@types/placeSerach';
import { bboxToPolygon } from '@/utils/geocoding';
import bbox from '@turf/bbox';
import { AllGeoJSON } from '@turf/helpers';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  LngLatBoundsLike,
  MapRef,
  SourceSpecification,
} from 'react-map-gl/mapbox';

type MapLocationProps = {
  mapRef: React.RefObject<MapRef | null>;
};

export const useMapLocation = ({ mapRef }: MapLocationProps) => {
  const locationSearchContext = useFormContext<PlaceSearchValues>();
  const currentPlace = locationSearchContext.watch('currentPlace');

  useEffect(() => {
    if (currentPlace) {
      const map = mapRef?.current?.getMap?.();
      const polygon = bboxToPolygon(currentPlace.boundingBox);

      const feature: SourceSpecification = {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: polygon,
          },
        },
      };

      if (map?.getSource('areaHighlight')) {
        map.removeLayer('areaHighlightLine');
        map.removeSource('areaHighlight');
      }

      map?.addSource('areaHighlight', feature);

      map?.addLayer({
        id: 'areaHighlightLine',
        type: 'line',
        source: 'areaHighlight',
        paint: {
          'line-color': '#00A8FF',
          'line-width': 3,
        },
      });

      const bounds = bbox(feature.data as AllGeoJSON);
      map?.fitBounds(bounds as LngLatBoundsLike, {
        padding: 40,
        linear: true,
        duration: 5000,
        animate: true,
      });
    }
  }, [currentPlace, mapRef]);

  return {};
};
