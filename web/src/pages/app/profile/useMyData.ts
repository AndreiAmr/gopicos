import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userProfileActions } from '@/store/userProfile/userProfileActions';
import { userProfileSelectors } from '@/store/userProfile/userProfileSelectors';

import {
  hasProfileChanges,
  validateProfileForm,
  type ProfileFormErrors,
} from './profileLogic';

/** Formulário "Meus dados" (P1+P2 na web): nome e sobrenome editáveis, e-mail só leitura. */
export const useMyData = () => {
  const dispatch = useDispatch();
  const me = useSelector(userProfileSelectors.getMe);
  const isLoading = useSelector(userProfileSelectors.getIsLoadingMe);
  const loadError = useSelector(userProfileSelectors.getErrorMe);
  const isSaving = useSelector(userProfileSelectors.getIsLoadingUpdate);
  const saveError = useSelector(userProfileSelectors.getErrorUpdate);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  // Carrega o perfil ao abrir a página.
  useEffect(() => {
    dispatch(userProfileActions.getMeAsync());
  }, [dispatch]);

  // Sincroniza o formulário com o perfil salvo (carga e depois de salvar).
  const savedFirstName = me?.firstName;
  const savedLastName = me?.lastName;
  useEffect(() => {
    if (savedFirstName === undefined || savedLastName === undefined) return;
    setFirstName(savedFirstName);
    setLastName(savedLastName);
    setSubmitted(false);
    setFieldErrors({});
  }, [savedFirstName, savedLastName]);

  const values = { firstName, lastName };
  const dirty = me ? hasProfileChanges(me, values) : false;

  // Aviso do navegador ao fechar a aba com alterações não salvas.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Erro de campo vindo do servidor tem prioridade sobre o do cliente.
  const serverField = saveError?.kind === 'field' ? saveError : null;
  useEffect(() => {
    if (serverField?.field === 'firstName') firstNameRef.current?.focus();
    if (serverField?.field === 'lastName') lastNameRef.current?.focus();
  }, [serverField]);

  const changeFirstName = (value: string) => {
    setFirstName(value);
    if (submitted) {
      setFieldErrors(validateProfileForm({ firstName: value, lastName }));
    }
  };

  const changeLastName = (value: string) => {
    setLastName(value);
    if (submitted) {
      setFieldErrors(validateProfileForm({ firstName, lastName: value }));
    }
  };

  const save = useCallback(() => {
    const errors = validateProfileForm({ firstName, lastName });
    setSubmitted(true);
    setFieldErrors(errors);

    if (errors.firstName) return firstNameRef.current?.focus();
    if (errors.lastName) return lastNameRef.current?.focus();

    dispatch(userProfileActions.setErrorUpdate(null));
    dispatch(
      userProfileActions.updateProfileAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    );
  }, [dispatch, firstName, lastName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || !dirty) return;
    save();
  };

  const retryLoad = useCallback(
    () => dispatch(userProfileActions.getMeAsync()),
    [dispatch],
  );

  return {
    me,
    // Skeleton só enquanto não há perfil em memória.
    isLoading: isLoading && !me,
    loadError: me ? null : loadError,
    isSaving,
    firstName,
    lastName,
    canSave: dirty && !isSaving,
    firstNameError:
      serverField?.field === 'firstName' ? serverField.message : fieldErrors.firstName,
    lastNameError:
      serverField?.field === 'lastName' ? serverField.message : fieldErrors.lastName,
    banner: saveError?.kind === 'banner' ? saveError.message : null,
    firstNameRef,
    lastNameRef,
    changeFirstName,
    changeLastName,
    handleSubmit,
    retrySave: save,
    retryLoad,
  };
};
