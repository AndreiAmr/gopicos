import { listSpotsActions } from '@/store/spot/modules/listSpots/listSpotsActions';
import { listSpotsSelectors } from '@/store/spot/modules/listSpots/listSpotsSelectors';
import { useEffect, useRef } from 'react';
import { MapRef } from 'react-map-gl/mapbox';
import { useDispatch, useSelector } from 'react-redux';
import { useMapLocation } from '@/hooks/useMapLocation';

export const useHome = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<MapRef>(null);
  const spots = useSelector(listSpotsSelectors.getListSpots);
  useMapLocation({ mapRef });

  useEffect(() => {
    dispatch(listSpotsActions.getListSpotsAsync());
  }, [dispatch]);

  return {
    spots,
    mapRef,
  };
};
