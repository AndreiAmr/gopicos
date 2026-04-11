import { reverseGeocodingActions } from '@/store/reverseGeocoding/reverseGeocodingActions';
import { reverseGeocodingSelectors } from '@/store/reverseGeocoding/reverseGeocodingSelectors';

import { useCreateSpotMutation } from '@/mutations/createSpotMutation/useCreateSpotMutation';

import { ISpot } from '@/store/spot/spotTypes';
import bbox from '@turf/bbox';
import { AllGeoJSON } from '@turf/helpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  LngLatBoundsLike,
  MapRef,
  SourceSpecification,
} from 'react-map-gl/mapbox';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'sonner';
import { ICreateSpot } from '@/pages/_layouts/NewSpotLayout';
import { useNavigate } from 'react-router';

export const useNewSpotDetails = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const mapRef = useRef<MapRef>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, setValue, handleSubmit, formState, watch, getValues } =
    useFormContext<ICreateSpot>();

  const {
    mutate: createSpot,
    isPending,
    isError,
    reset,
  } = useCreateSpotMutation();

  const currentCoordinates = watch('coordinates');
  const reverseGeocoding = useSelector(
    reverseGeocodingSelectors.getReverseGeocoding,
  );

  const isLoadingReverseGeocoding = useSelector(
    reverseGeocodingSelectors.getIsLoadingReverseGeocoding,
  );

  const errors = formState.errors;

  const isPaid = watch('isPaid');
  const equipamentRequired = watch('equipamentRequired');
  const alwaysOpen = watch('alwaysOpen');
  const hasCoverage = watch('hasCoverage');

  const spotFake = useMemo(
    (): ISpot => ({
      alwaysOpen: false,
      coordinates: (currentCoordinates
        ? currentCoordinates
        : []) as number[][][],
      description: '',
      name: '',
      entryAmount: '',
      equipmentRequired: false,
      hasCoverage: false,
      id: '',
      images: [],
      isPaid: false,
      markingType: '',
      modality: '',
    }),
    [currentCoordinates],
  );

  const bounds = useMemo(() => {
    const feature: SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: currentCoordinates as number[][][],
        },
      },
    };

    const bounds = bbox(feature.data as AllGeoJSON);

    return bounds;
  }, [currentCoordinates]);

  const submitHandler = useCallback(() => {
    const allValues = getValues();

    const toastId = toast.loading('Criando spot...');

    createSpot(
      {
        ...allValues,
        coordinates: currentCoordinates || [],
        images: selectedFiles,
      },
      {
        onSuccess: () => {
          toast.success('Spot criado com sucesso!', { id: toastId });
          navigate('/home');
          reset();
        },
        onError: () => {
          toast.error('Erro ao criar spot', { id: toastId });
          reset();
        },
      },
    );
  }, [createSpot, getValues, currentCoordinates, selectedFiles, reset]);

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.fitBounds(bounds as LngLatBoundsLike, {
        padding: 40,
        linear: true,
        duration: 2000,
        animate: true,
      });
    }, 1500);

    dispatch(
      reverseGeocodingActions.getReverseGeocodingAsync(bounds[1], bounds[0]),
    );
  }, [dispatch, currentCoordinates, mapRef, bounds]);

  useEffect(() => {
    if (reverseGeocoding) {
      setValue('road', reverseGeocoding?.road);
      setValue('suburb', reverseGeocoding?.suburb);
      setValue('quarter', reverseGeocoding?.quarter);
    }
  }, [reverseGeocoding, setValue]);

  useEffect(() => {
    setValue('images', selectedFiles);
  }, [selectedFiles, setValue]);

  return {
    mapRef,
    register,
    spotFake,
    reverseGeocoding,
    isLoadingReverseGeocoding,
    handleSubmit,
    errors,
    isPaid,
    equipamentRequired,
    alwaysOpen,
    hasCoverage,
    setValue,
    submitHandler,
    selectedFiles,
    setSelectedFiles,
    isLoading: isPending,
    isError,
    resetError: reset,
  };
};
