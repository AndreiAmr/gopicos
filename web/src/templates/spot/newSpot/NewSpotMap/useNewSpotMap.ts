import { useCallback, useMemo, useRef, useState } from 'react';

import { ICoordinates } from '@/store/spot/modules/createSpot/createSpotTypes';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { useMapLocation } from '@/hooks/useMapLocation';
import { MapRef } from 'react-map-gl/mapbox';

import { useFormContext } from 'react-hook-form';
import { ICreateSpot } from '@/pages/_layouts/NewSpotLayout';

type IGeometry = {
  coordinates: ICoordinates;
  type: string;
};

export const useNewSpotMap = () => {
  const mapRef = useRef<MapRef>(null);
  useMapLocation({ mapRef });
  const { setValue, watch } = useFormContext<ICreateSpot>();

  const coordinatesStored = watch('coordinates');

  const [coordinates, setCoordinates] = useState<ICoordinates>(
    coordinatesStored || [],
  );

  const handleCreate = useCallback((event: MapboxDraw.DrawCreateEvent) => {
    const geometry = event.features[0].geometry as IGeometry;

    setCoordinates(geometry.coordinates);
  }, []);

  const handleUpdate = useCallback((event: MapboxDraw.DrawCreateEvent) => {
    const geometry = event.features[0].geometry as IGeometry;

    setCoordinates(geometry.coordinates);
  }, []);

  const handleDelete = useCallback(() => {
    setCoordinates([]);
  }, []);

  const showContinueButton = useMemo(() => coordinates.length, [coordinates]);

  const handleNextStep = useCallback(() => {
    setValue('coordinates', coordinates);
    setValue('currentStep', 1);
  }, [coordinates, setValue]);

  return {
    mapRef,
    handleCreate,
    showContinueButton,
    handleUpdate,
    handleDelete,
    handleNextStep,
  };
};
