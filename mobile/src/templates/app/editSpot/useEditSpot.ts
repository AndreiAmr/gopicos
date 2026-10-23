import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApolloClient } from '@apollo/client/react';
import type { ImagePickerResponse } from 'react-native-image-picker';
import { useToast } from '../../../atomic/ds/molecules/Toast';
import {
  EditablePhoto,
  Polygon,
  isUnchanged,
  newPhotos,
  spotPhotos,
  spotToFormData,
  toUpdateSpotInput,
} from '../../../domain/spot/editSpotForm';
import { fromPolygon } from '../../../domain/spot/polygonDraft';
import {
  FIELD_ORDER,
  NewSpotFormData,
  PHOTO_LIMITS,
  addPhotos,
  newSpotDefaults,
  newSpotSchema,
  photoCounter,
  photosError,
} from '../../../domain/spot/newSpotForm';
import { useSpotDetailsQuery } from '../../../hooks/query/spotDetails/useSpotDetailsQuery';
import { clearSession } from '../../../services/session';
import {
  UpdateSpotError,
  updateSpotRequest,
} from '../../../services/spot/updateSpot';
import { askForPhoto, toPicked } from '../newSpot/details/pickPhoto';
import type { RootStackParamList } from '../../../routes/types';

export const editSpotStrings = {
  title: 'Editar pico',
  cancel: 'Cancelar',
  back: 'Cancelar edição',
  submit: 'Salvar alterações',
  saving: 'Salvando',
  success: 'Alterações salvas.',
  fixFields: 'Corrija os campos destacados',
  lastPhoto: 'O pico precisa ter ao menos 1 foto.',
  networkError: 'Não foi possível salvar. Suas edições foram mantidas.',
  retry: 'Tentar novamente',
  loadError: 'Não foi possível carregar o pico. Verifique sua conexão.',
  notFoundTitle: 'Pico não encontrado',
  notFoundDescription: 'Ele pode ter sido excluído ou o link está errado.',
  backToMap: 'Voltar ao mapa',
  notAuthor: 'Só quem criou o pico pode editá-lo.',
  gone: 'Este pico já não existe.',
  discardTitle: 'Descartar alterações?',
  discard: 'Descartar',
  keepEditing: 'Continuar editando',
} as const;

const FORM_FIELDS = new Set<string>(FIELD_ORDER);

export const useEditSpot = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'EditSpot'>>();
  const toast = useToast();
  const apollo = useApolloClient();
  const { spot, status, refetch } = useSpotDetailsQuery(params.id);

  const form = useForm<NewSpotFormData>({
    defaultValues: newSpotDefaults,
    resolver: yupResolver(newSpotSchema),
    mode: 'onTouched',
  });

  const [photos, setPhotos] = useState<EditablePhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const done = useRef(false);

  // Preenche o formulário uma única vez, quando o pico chega.
  useEffect(() => {
    if (spot && !initialized) {
      if (!spot.isOwner) {
        done.current = true;
        toast.show({ type: 'error', message: editSpotStrings.notAuthor });
        navigation.goBack();
        return;
      }
      form.reset(spotToFormData(spot));
      setPhotos(spotPhotos(spot));
      setInitialized(true);
    }
  }, [spot, initialized, form, navigation, toast]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      done.current = true;
      clearSession()
        .catch(() => undefined)
        .finally(() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
          }),
        );
    }
  }, [status, navigation]);

  const polygon = (params.coordinates ?? spot?.coordinates ?? null) as Polygon | null;
  const pointsCount = polygon ? fromPolygon(polygon).length : 0;

  const values = form.watch();
  const dirty = useMemo(
    () =>
      Boolean(
        spot && polygon && initialized && !isUnchanged(spot, values, polygon, photos),
      ),
    [spot, polygon, initialized, values, photos],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!dirty || done.current || event.data.action.type === 'RESET') return;
      event.preventDefault();
      Alert.alert(editSpotStrings.discardTitle, undefined, [
        { text: editSpotStrings.keepEditing, style: 'cancel' },
        {
          text: editSpotStrings.discard,
          style: 'destructive',
          onPress: () => navigation.dispatch(event.data.action),
        },
      ]);
    });
    return unsubscribe;
  }, [navigation, dirty]);

  const handlePicked = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode) return;
    setPhotos(current => {
      const result = addPhotos<EditablePhoto>(current, toPicked(response.assets));
      setPhotoError(result.errors[0]);
      return result.photos;
    });
  }, []);

  const addPhoto = useCallback(() => {
    const remaining = PHOTO_LIMITS.max - photos.length;
    if (remaining > 0) askForPhoto(remaining, handlePicked);
  }, [handlePicked, photos.length]);

  const removePhoto = useCallback(
    (index: number) => {
      if (photos.length <= PHOTO_LIMITS.min) {
        setPhotoError(editSpotStrings.lastPhoto);
        return;
      }
      setPhotos(current => current.filter((_, i) => i !== index));
      setPhotoError(undefined);
    },
    [photos.length],
  );

  const send = useCallback(
    async (data: NewSpotFormData) => {
      if (!spot || !polygon) return;

      const missingPhotos = photosError(photos);
      if (missingPhotos) {
        setPhotoError(missingPhotos);
        return;
      }

      if (isUnchanged(spot, data, polygon, photos)) {
        done.current = true;
        navigation.goBack();
        return;
      }

      setBanner(null);
      setSubmitting(true);
      AccessibilityInfo.announceForAccessibility(editSpotStrings.saving);

      try {
        await updateSpotRequest(
          spot.id,
          toUpdateSpotInput(data, polygon, photos),
          newPhotos(photos),
        );
        done.current = true;
        // Detalhe e mapa refletem a mudança sem recarregar o app.
        apollo
          .refetchQueries({ include: ['GetSpotById', 'GetAllSpots'] })
          .catch(() => undefined);
        toast.show({ type: 'success', message: editSpotStrings.success });
        navigation.goBack();
      } catch (error) {
        const apiError =
          error instanceof UpdateSpotError ? error.apiError : null;

        if (apiError?.type === 'UNAUTHENTICATED') {
          done.current = true;
          await clearSession().catch(() => undefined);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
          });
          return;
        }

        if (apiError?.type === 'FORBIDDEN') {
          done.current = true;
          toast.show({ type: 'error', message: editSpotStrings.notAuthor });
          navigation.goBack();
          return;
        }

        if (apiError?.type === 'NOT_FOUND') {
          done.current = true;
          apollo.refetchQueries({ include: ['GetAllSpots'] }).catch(() => undefined);
          toast.show({ type: 'info', message: editSpotStrings.gone });
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          return;
        }

        if (apiError?.type === 'VALIDATION_ERROR' && apiError.field) {
          const field = (apiError as { field?: string }).field as string;
          if (field === 'images') {
            setPhotoError(apiError.message);
          } else if (FORM_FIELDS.has(field)) {
            form.setError(
              field as keyof NewSpotFormData,
              { message: apiError.message },
              { shouldFocus: true },
            );
          } else {
            setBanner(apiError.message);
          }
        } else {
          // Rede ou servidor: nada é perdido.
          setBanner(apiError?.message ?? editSpotStrings.networkError);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [apollo, form, navigation, photos, polygon, spot, toast],
  );

  const submit = form.handleSubmit(send, () => {
    AccessibilityInfo.announceForAccessibility(editSpotStrings.fixFields);
  });

  const goHome = useCallback(() => navigation.navigate('Home'), [navigation]);

  return {
    status,
    ready: status === 'ready' && initialized,
    retry: refetch,
    goHome,
    form,
    pointsCount,
    photos,
    photoError,
    photoCounter: photoCounter(photos.length),
    addPhoto,
    removePhoto,
    submitting,
    banner,
    submit,
    cancel: () => navigation.goBack(),
    changeLocation: () => {
      if (polygon) {
        navigation.navigate('EditSpotLocation', {
          id: params.id,
          coordinates: polygon,
        });
      }
    },
    // Exposto para testes.
    handlePicked,
  };
};
