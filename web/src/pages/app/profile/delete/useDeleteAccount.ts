import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userProfileActions } from '@/store/userProfile/userProfileActions';
import { userProfileSelectors } from '@/store/userProfile/userProfileSelectors';

import { DELETE_STRINGS, keepsActivityText } from '../profileLogic';

export const useDeleteAccount = (open: boolean) => {
  const dispatch = useDispatch();
  const me = useSelector(userProfileSelectors.getMe);
  const isLoading = useSelector(userProfileSelectors.getIsLoadingDelete);
  const serverError = useSelector(userProfileSelectors.getErrorDelete);

  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | undefined>();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Ao fechar/abrir: campo e erros zerados (a senha não fica na memória da tela).
  useEffect(() => {
    setPassword('');
    setClientError(undefined);
    dispatch(userProfileActions.setErrorDelete(null));
  }, [open, dispatch]);

  // Senha incorreta: foco no campo com o texto selecionado.
  const serverField = serverError?.kind === 'field' ? serverError : null;
  useEffect(() => {
    if (serverField) {
      passwordRef.current?.focus();
      passwordRef.current?.select();
    }
  }, [serverField]);

  const changePassword = (value: string) => {
    setPassword(value);
    if (clientError) setClientError(undefined);
  };

  const submit = useCallback(() => {
    if (!password) {
      setClientError(DELETE_STRINGS.emptyPassword);
      passwordRef.current?.focus();
      return;
    }

    dispatch(userProfileActions.setErrorDelete(null));
    dispatch(userProfileActions.deleteAccountAsync(password));
  }, [dispatch, password]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    submit();
  };

  return {
    isLoading,
    password,
    passwordError: serverField?.message ?? clientError,
    banner: serverError?.kind === 'banner' ? serverError.message : null,
    // A tela nunca espera as contagens: sem elas usa o texto genérico (spec 7.2).
    keepsActivity: keepsActivityText(me?.spotsCount, me?.reviewsCount),
    titleRef,
    passwordRef,
    changePassword,
    handleSubmit,
    retry: submit,
  };
};
