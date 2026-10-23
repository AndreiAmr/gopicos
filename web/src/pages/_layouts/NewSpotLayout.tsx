import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Outlet, useBlocker } from 'react-router';

import { Button } from '@/atomic/atoms/button';
import { Modal } from '@/atomic/molecules/modal';
import {
  newSpotDefaults,
  newSpotSchema,
  type NewSpotFormData,
  type Position,
} from '@/domain/spot/newSpotForm';
import { URL } from '@/routes/url';

import { NewSpotDraftContext } from './newSpotDraft';

const isInsideWizard = (pathname: string) =>
  pathname === URL.NEW_SPOT || pathname === URL.NEW_SPOT_DETAILS;

/** Guarda o rascunho entre os passos e confirma antes de descartar dados preenchidos. */
const NewSpotLayout = () => {
  const form = useForm<NewSpotFormData>({
    defaultValues: newSpotDefaults,
    resolver: yupResolver(newSpotSchema),
    mode: 'onTouched',
  });
  const [points, setPoints] = useState<Position[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const leaveAllowed = useRef(false);

  const dirty = points.length > 0 || photos.length > 0 || form.formState.isDirty;

  const allowLeave = useCallback(() => {
    leaveAllowed.current = true;
  }, []);

  const blocker = useBlocker(
    ({ nextLocation }) =>
      dirty && !leaveAllowed.current && !isInsideWizard(nextLocation.pathname),
  );

  // Fechar a aba ou recarregar com dados também pede confirmação.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (leaveAllowed.current) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const draft = useMemo(
    () => ({ form, points, setPoints, photos, setPhotos, allowLeave }),
    [form, points, photos, allowLeave],
  );

  return (
    <NewSpotDraftContext.Provider value={draft}>
      <Outlet />
      <Modal
        open={blocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.state === 'blocked') blocker.reset();
        }}
        title="Descartar este cadastro?"
        description="Os dados preenchidos serão perdidos."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => blocker.state === 'blocked' && blocker.reset()}
            >
              Continuar editando
            </Button>
            <Button
              variant="destructive"
              onClick={() => blocker.state === 'blocked' && blocker.proceed()}
            >
              Descartar
            </Button>
          </>
        }
      />
    </NewSpotDraftContext.Provider>
  );
};

export default NewSpotLayout;
