import { reverseGeocodingActions } from '@/store/reverseGeocoding/reverseGeocodingActions';
import { reverseGeocodingSelectors } from '@/store/reverseGeocoding/reverseGeocodingSelectors';
import { createSpotSelectors } from '@/store/spot/modules/createSpot/createSpotSelectors';
import { useCreateSpotMutation } from '@/mutations/createSpotMutation/useCreateSpotMutation';

import { ISpot } from '@/store/spot/spotTypes';
import bbox from '@turf/bbox';
import { AllGeoJSON } from '@turf/helpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LngLatBoundsLike,
  MapRef,
  SourceSpecification,
} from 'react-map-gl/mapbox';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Mínimo 3 caracteres'),
  images: yup
    .number()
    .min(1, 'Selecione ao menos uma imagem')
    .required('Imagens é obrigatório'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(20, 'Mínimo 20 caracteres'),
  road: yup.string().required('Rua é obrigatória'),
  suburb: yup.string().required('Bairro é obrigatório'),
  quarter: yup.string(),
  number: yup.string(),
  complement: yup.string(),
  reference: yup.string().min(20, 'Mínimo 20 caracteres'),
  modality: yup.string().required('Modalidade é obrigatória'),
  equipamentRequired: yup.boolean(),
  hasCoverage: yup.boolean(),
  alwaysOpen: yup.boolean(),
  openingTime: yup.string().when('alwaysOpen', {
    is: false,
    then: (schema) => schema.required('Horário de abertura é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  closingTime: yup.string().when('alwaysOpen', {
    is: false,
    then: (schema) => schema.required('Horário de fechamento é obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
  isPaid: yup.boolean(),
  entryAmount: yup.string().when('isPaid', {
    is: true,
    then: (schema) => schema.required('Valor de entrada obrigatório'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const defaultValues = {
  name: '',
  description: '',
  road: '',
  suburb: '',
  quarter: '',
  number: '',
  complement: '',
  reference: '',
  modality: '',
  equipamentRequired: false,
  hasCoverage: false,
  alwaysOpen: true,
  openingTime: '',
  closingTime: '',
  isPaid: false,
  entryAmount: '',
  images: 0,
};

export const useNewSpotDetails = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const mapRef = useRef<MapRef>(null);
  const dispatch = useDispatch();

  const {
    mutate: createSpot,
    isPending,
    isError,
    reset,
  } = useCreateSpotMutation();

  const currentCoordinates = useSelector(
    createSpotSelectors.getCreateSpotCoordinates,
  );
  const reverseGeocoding = useSelector(
    reverseGeocodingSelectors.getReverseGeocoding,
  );

  const isLoadingReverseGeocoding = useSelector(
    reverseGeocodingSelectors.getIsLoadingReverseGeocoding,
  );

  const { register, setValue, handleSubmit, formState, watch, getValues } =
    useForm({
      defaultValues,
      resolver: yupResolver(validationSchema),
      mode: 'onSubmit',
    });

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
    setValue('images', selectedFiles.length);
  }, [selectedFiles.length, setValue]);

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
