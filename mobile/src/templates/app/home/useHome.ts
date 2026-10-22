// import { Spot } from '../../../store/spots/allSpots/allSpotsTypes';
import { allSpotsSelectors } from '../../../store/spots/allSpots/allSpotsSlice';
import { useSelector } from 'react-redux';

const getPolygonCenter = (coordinates: number[][][]): [number, number] => {
  const ring = coordinates[0];

  const longitudes = ring.map(([longitude]) => longitude);
  const latitudes = ring.map(([, latitude]) => latitude);

  return [
    (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
  ];
};

export const useHome = () => {
  const spots = useSelector(allSpotsSelectors.getData);

  const mountPolygons = (): GeoJSON.FeatureCollection<GeoJSON.Polygon> => {
    return {
      type: 'FeatureCollection' as const,
      features: spots?.map(spot => ({
        type: 'Feature' as const,
        properties: {
          id: spot.id,
          name: spot.name,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: spot.coordinates,
        },
      })),
    };
  };

  const mountSpotCenters = (): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    return {
      type: 'FeatureCollection',
      features: (spots ?? []).map(spot => ({
        type: 'Feature',
        properties: {
          id: spot.id,
          name: spot.name,
        },
        geometry: {
          type: 'Point',
          coordinates: getPolygonCenter(spot.coordinates),
        },
      })),
    };
  };

  return { spots, mountPolygons, mountSpotCenters };
};
