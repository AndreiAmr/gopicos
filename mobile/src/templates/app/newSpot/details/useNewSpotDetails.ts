import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApolloClient } from '@apollo/client/react';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useToast } from '../../../../atomic/ds/molecules/Toast';
import {
  FIELD_ORDER,
  NewSpotFormData,
  PHOTO_LIMITS,
  PickedPhoto,
  addPhotos,
  newSpotDefaults,
  newSpotSchema,
  photoCounter,
  photosError,
  toCreateSpotInput,
} from '../../../../domain/spot/newSpotForm';
import {
  CreateSpotError,
  createSpotRequest,
} from '../../../../services/spot/createSpot';
import { clearSession } from '../../../../services/session';
import type { RootStackParamList } from '../../../../routes/types';

export const newSpotDetailsStrings = {
  step: 'Passo 2 de 2',
  title: 'Detalhes do pico',
  location: (n: number) => `Local marcado, ${n} pontos`,
  changeLocation: 'Alterar',
  photos: 'Fotos (1 a 5, até 5 MB cada)',
  takePhoto: 'Tirar foto',
  pickFromGallery: 'Escolher da galeria',
  cancel: 'Cancelar',
  addPhotoTitle: 'Adicionar foto',
  name: 'Nome',
  description: 'Descrição',
  modality: 'Modalidade',
  entry: 'Entrada',
  free: 'Gratuito',
  paid: 'Pago',
  entryAmount: 'Valor',
  entryAmountPlaceholder: 'R$ 20',
  alwaysOpen: 'Aberto 24 horas',
  openingHours: 'Horário de funcionamento',
  openingHoursPlaceholder: 'Seg a sex, 8h às 22h',
  hasCoverage: 'Coberto',
  equipmentRequired: 'Exige equipamento de proteção',
  submit: 'Criar pico',
  saving: 'Salvando',
  fixFields: 'Corrija os campos destacados',
  success: 'Pico criado!',
  networkError: 'Não foi possível criar o pico. Seus dados foram mantidos.',
  retry: 'Tentar novamente',
  discardTitle: 'Descartar este cadastro?',
  discard: 'Descartar',
  keepEditing: 'Continuar editando',
} as const;

const FORM_FIELDS = new Set<string>(FIELD_ORDER);

const toPicked = (assets: Asset[] = []): PickedPhoto[] =>
  assets
    .filter(asset => asset.uri)
    .map((asset, index) => ({
      uri: asset.uri as string,
      name: asset.fileName ?? `foto-${Date.now()}-${index}.jpg`,
      type: asset.type ?? 'image/jpeg',
      size: asset.fileSize,
    }));

export const useNewSpotDetails = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'NewSpotDetails'>>();
  const toast = useToast();
  const apollo = useApolloClient();

  const form = useForm<NewSpotFormData>({
    defaultValues: newSpotDefaults,
    resolver: yupResolver(newSpotSchema),
    mode: 'onTouched',
  });

  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const done = useRef(false);

  const pointsCount = Math.max(
    (params.coordinates.coordinates[0]?.length ?? 1) - 1,
    0,
  );

  const handlePicked = useCallback(
    (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) return;
      setPhotos(current => {
        const result = addPhotos(current, toPicked(response.assets));
        setPhotoError(result.errors[0]);
        return result.photos;
      });
    },
    [],
  );

  const addPhoto = useCallback(() => {
    const remaining = PHOTO_LIMITS.max - photos.length;
    if (remaining <= 0) return;

    Alert.alert(newSpotDetailsStrings.addPhotoTitle, undefined, [
      {
        text: newSpotDetailsStrings.takePhoto,
        onPress: () =>
          launchCamera({ mediaType: 'photo', quality: 0.8 }, handlePicked),
      },
      {
        text: newSpotDetailsStrings.pickFromGallery,
        onPress: () =>
          launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, selectionLimit: remaining },
            handlePicked,
          ),
      },
      { text: newSpotDetailsStrings.cancel, style: 'cancel' },
    ]);
  }, [handlePicked, photos.length]);

  const removePhoto = useCallback((index: number) => {
    setPhotos(current => current.filter((_, i) => i !== index));
    setPhotoError(undefined);
  }, []);

  const dirty = form.formState.isDirty || photos.length > 0;

  // Sair com dados pede confirmação; o reset do sucesso passa direto.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!dirty || done.current || event.data.action.type === 'RESET') {
        return;
      }
      event.preventDefault();
      Alert.alert(newSpotDetailsStrings.discardTitle, undefined, [
        { text: newSpotDetailsStrings.keepEditing, style: 'cancel' },
        {
          text: newSpotDetailsStrings.discard,
          style: 'destructive',
          onPress: () => navigation.dispatch(event.data.action),
        },
      ]);
    });
    return unsubscribe;
  }, [navigation, dirty]);

  const send = useCallback(
    async (data: NewSpotFormData) => {
      const missingPhotos = photosError(photos);
      if (missingPhotos) {
        setPhotoError(missingPhotos);
        AccessibilityInfo.announceForAccessibility(
          newSpotDetailsStrings.fixFields,
        );
        return;
      }

      setBanner(null);
      setSubmitting(true);
      AccessibilityInfo.announceForAccessibility(newSpotDetailsStrings.saving);

      try {
        const id = await createSpotRequest(
          toCreateSpotInput(data, params.coordinates),
          photos,
        );
        done.current = true;
        apollo.refetchQueries({ include: ['GetAllSpots'] }).catch(() => undefined);
        toast.show({ type: 'success', message: newSpotDetailsStrings.success });
        navigation.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'SpotDetails', params: { id } }],
        });
      } catch (error) {
        const apiError =
          error instanceof CreateSpotError ? error.apiError : null;

        if (apiError?.type === 'UNAUTHENTICATED') {
          done.current = true;
          await clearSession().catch(() => undefined);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
          });
          return;
        }

        if (apiError?.type === 'VALIDATION_ERROR' && apiError.field) {
          if (apiError.field === 'images') {
            setPhotoError(apiError.message);
          } else if (FORM_FIELDS.has(apiError.field)) {
            form.setError(
              apiError.field as keyof NewSpotFormData,
              { message: apiError.message },
              { shouldFocus: true },
            );
          } else {
            setBanner(apiError.message);
          }
        } else {
          // Rede ou servidor: nada é limpo.
          setBanner(apiError?.message ?? newSpotDetailsStrings.networkError);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [apollo, form, navigation, params.coordinates, photos, toast],
  );

  const submit = form.handleSubmit(send, () => {
    if (photos.length < PHOTO_LIMITS.min) setPhotoError(photosError(photos));
    AccessibilityInfo.announceForAccessibility(newSpotDetailsStrings.fixFields);
  });

  return {
    form,
    coordinates: params.coordinates,
    pointsCount,
    photos,
    photoError,
    photoCounter: photoCounter(photos.length),
    addPhoto,
    removePhoto,
    submitting,
    banner,
    submit,
    changeLocation: () => navigation.goBack(),
    // Exposto para testes.
    handlePicked,
  };
};
