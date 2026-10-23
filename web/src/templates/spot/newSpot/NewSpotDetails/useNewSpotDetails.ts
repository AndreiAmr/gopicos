import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import type { FieldErrors } from 'react-hook-form';

import {
  FIELD_ORDER,
  addPhotos,
  photosError,
  toCreateSpotInput,
  type NewSpotFormData,
} from '@/domain/spot/newSpotForm';
import { notify } from '@/lib/notify';
import {
  CreateSpotError,
  createSpotRequest,
} from '@/mutations/createSpotMutation/useCreateSpotMutation';
import { useNewSpotDraft } from '@/pages/_layouts/newSpotDraft';
import { URL } from '@/routes/url';
import { listSpotsActions } from '@/store/spot/modules/listSpots/listSpotsActions';
import { logout } from '@/utils/logout';

export const newSpotStrings = {
  fixFields: 'Corrija os campos destacados',
  networkError: 'Não foi possível criar o pico. Seus dados foram mantidos.',
  retry: 'Tentar novamente',
  success: 'Pico criado!',
} as const;

const FORM_FIELDS = new Set<string>(FIELD_ORDER);

const focusField = (name: string) => {
  const element = document.getElementById(`spot-${name}`);
  element?.scrollIntoView({ block: 'center' });
  element?.focus();
};

export const useNewSpotDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, points, photos, setPhotos, allowLeave } = useNewSpotDraft();

  const [photoError, setPhotoError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<{ message: string; network: boolean } | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    document.title = 'Detalhes do pico - GoPicos';
  }, []);

  const hasLocation = points.length >= 3;

  const handleAddPhotos = useCallback(
    (files: File[]) => {
      const result = addPhotos(photos, files);
      setPhotos(result.photos);
      setPhotoError(result.errors[0]);
    },
    [photos, setPhotos],
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      setPhotos((current) => current.filter((_, i) => i !== index));
      setPhotoError(undefined);
    },
    [setPhotos],
  );

  const send = useCallback(
    async (data: NewSpotFormData) => {
      const missing = photosError(photos);
      if (missing) {
        setPhotoError(missing);
        setAnnouncement(newSpotStrings.fixFields);
        focusField('photos');
        return;
      }

      setBanner(null);
      setSubmitting(true);
      try {
        const id = await createSpotRequest(
          toCreateSpotInput(data, points),
          photos,
        );
        allowLeave();
        dispatch(listSpotsActions.getListSpotsAsync());
        notify.success(newSpotStrings.success);
        navigate(`/spot/${id}`, { replace: true });
      } catch (error) {
        const failure =
          error instanceof CreateSpotError
            ? error
            : new CreateSpotError('Falha de rede');

        if (failure.type === 'UNAUTHENTICATED') {
          allowLeave();
          void logout({ sessionExpired: true });
          return;
        }

        if (failure.field && FORM_FIELDS.has(failure.field)) {
          form.setError(failure.field as keyof NewSpotFormData, {
            message: failure.message,
          });
          focusField(failure.field);
        } else if (failure.field === 'images') {
          setPhotoError(failure.message);
        } else if (failure.field === 'coordinates') {
          setBanner({ message: failure.message, network: false });
        } else {
          setBanner({
            message: failure.isNetwork
              ? newSpotStrings.networkError
              : failure.message,
            network: failure.isNetwork,
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [photos, points, allowLeave, dispatch, navigate, form],
  );

  const onInvalid = useCallback(
    (errors: FieldErrors<NewSpotFormData>) => {
      setAnnouncement(newSpotStrings.fixFields);
      if (photosError(photos)) setPhotoError(photosError(photos));
      const first = FIELD_ORDER.find((name) => errors[name]);
      if (first) focusField(first);
    },
    [photos],
  );

  const submit = form.handleSubmit(send, onInvalid);

  const changeLocation = useCallback(() => navigate(URL.NEW_SPOT), [navigate]);

  return {
    form,
    points,
    hasLocation,
    photos,
    photoError,
    submitting,
    banner,
    announcement,
    submit,
    handleAddPhotos,
    handleRemovePhoto,
    changeLocation,
  };
};
