import _ from 'lodash';

import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

type HandleMapClickProps = {
  lat: number;
  lng: number;
};

export const useNewSpotMap = () => {
  const { watch, setValue } = useFormContext<NewSpotProps>();

  const coordinates = watch('address.coordinates');

  const lat = watch('address.lat');
  const lng = watch('address.lng');
  const boundingBox = watch('boundingBox');
  const markingType = watch('markingType');

  const coordinatesTes = useMemo(() => {
    if (!coordinates || _.isEmpty(coordinates)) return [];

    return [[coordinates[0]], [coordinates[0]]];
  }, [coordinates]);

  const handleCreatePolygon = useCallback(
    ({ lat, lng }: HandleMapClickProps) => {
      if (_.isEmpty(coordinates)) {
        setValue('address.coordinates', [
          [
            [lng, lat],
            [lng, lat],
          ],
        ]);
        return;
      }

      const existingCoordinates = coordinates[0] as number[][];

      const newCoordinates = existingCoordinates.filter(
        (_, index) => existingCoordinates.length - 1 !== index
      );

      newCoordinates.push([lng, lat]);
      newCoordinates.push(existingCoordinates[0]);

      setValue('address.coordinates', [newCoordinates]);
    },
    [coordinates, setValue]
  );

  const handleMarkPoint = useCallback(({ lat, lng }: HandleMapClickProps) => {
    setValue('address.coordinates', [lng, lat]);
  }, []);

  const handleMapClick = useCallback(
    ({ lat, lng }: HandleMapClickProps) => {
      if (markingType === 'POINT') {
        handleMarkPoint({ lat, lng });
        return;
      }

      handleCreatePolygon({ lat, lng });
    },
    [coordinates, setValue]
  );

  return {
    coordinates,
    lat,
    lng,
    handleMapClick,
    coordinatesTes,
    boundingBox,
    markingType,
  };
};
