import {
  fowardGeocodingQuery,
  IFowardGeocoding,
} from '@/repository/geocoding/geocodingRepository';
import { useLazyQuery } from '@apollo/client';
import _, { first } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const useNewSpotMapControls = () => {
  const router = useRouter();

  const formMethods = useFormContext<NewSpotProps>();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [request, { loading, data }] = useLazyQuery<IFowardGeocoding>(
    fowardGeocodingQuery,
    {
      variables: { search },
    }
  );

  const markingType = formMethods.watch('markingType');
  const coordinates = formMethods.watch('address.coordinates');
  // console.log('🚀 ~ useNewSpotMapControls ~ coordinates:', coordinates);

  const handleFetchSearch = useCallback(
    async (search: string) => {
      await request({
        variables: {
          search,
        },
      });
    },
    [request]
  );

  const debouncedFetch = useMemo(
    () => _.debounce(handleFetchSearch, 1000, { maxWait: 1000 }),
    [handleFetchSearch]
  );

  const handleClickItem = useCallback(
    (lat?: number, lng?: number, boundingBox?: number[]) => {
      formMethods.setValue('address.lat', lat);
      formMethods.setValue('address.lng', lng);
      formMethods.setValue('boundingBox', boundingBox);

      setIsPopoverOpen(false);
    },
    [formMethods]
  );

  const handleChangeMarkingType = useCallback(
    (type: MarkingType) => {
      formMethods.setValue('address.coordinates', []);
      formMethods.setValue('markingType', type);
    },
    [formMethods]
  );

  const handleRedo = useCallback(() => {
    if (markingType === 'POLYGON') {
      const firstItem =
        coordinates && coordinates[0] ? (coordinates[0] as number[][]) : [];

      // console.log(firstItem);
      console.log('🚀 ~ useNewSpotMapControls ~ firstItem:', firstItem);

      formMethods.setValue(
        'address.coordinates',
        firstItem.length
          ? [
              firstItem.filter(
                (_, index) =>
                  index !== firstItem.length - (firstItem.length > 2 ? 2 : 1)
              ) as number[][],
            ]
          : []
      );
    }
  }, [coordinates, formMethods, markingType]);

  const handleTrash = useCallback(() => {
    formMethods.setValue('address.coordinates', []);
  }, [formMethods]);

  const handleContinue = useCallback(() => {
    router.push('/spot/new-spot/spotDetails');
  }, [router]);

  useEffect(() => {
    debouncedFetch(search);

    return () => {
      debouncedFetch.cancel();
    };
  }, [search, debouncedFetch]);

  return {
    search,
    setSearch,
    loading,
    data,
    isPopoverOpen,
    setIsPopoverOpen,
    handleClickItem,
    markingType,
    handleChangeMarkingType,
    handleRedo,
    handleTrash,
    handleContinue,
  };
};
