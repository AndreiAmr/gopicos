import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userProfileActions } from '@/store/userProfile/userProfileActions';
import { userProfileSelectors } from '@/store/userProfile/userProfileSelectors';

import {
  validatePasswordForm,
  type PasswordFormErrors,
  type PasswordFormValues,
} from './passwordLogic';

const EMPTY: PasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const useChangePassword = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userProfileSelectors.getIsLoadingPassword);
  const serverError = useSelector(userProfileSelectors.getErrorPassword);
  const success = useSelector(userProfileSelectors.getSuccessPassword);

  const [values, setValues] = useState<PasswordFormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<PasswordFormErrors>({});

  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  // Sucesso: limpa os três campos (senha não fica na tela) e volta o foco ao primeiro.
  useEffect(() => {
    if (!success) return;
    setValues(EMPTY);
    setSubmitted(false);
    setErrors({});
    dispatch(userProfileActions.setSuccessPassword(false));
    currentRef.current?.focus();
  }, [success, dispatch]);

  // Limpa erro de uma tentativa anterior ao sair da página.
  useEffect(
    () => () => {
      dispatch(userProfileActions.setErrorPassword(null));
    },
    [dispatch],
  );

  // Senha atual incorreta: foco no campo com o texto selecionado.
  const serverField = serverError?.kind === 'field' ? serverError : null;
  useEffect(() => {
    if (serverField?.field === 'currentPassword') {
      currentRef.current?.focus();
      currentRef.current?.select();
    }
    if (serverField?.field === 'newPassword') newRef.current?.focus();
  }, [serverField]);

  const change = (field: keyof PasswordFormValues) => (value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validatePasswordForm(next));
  };

  // A confirmação também é validada ao sair do campo, antes do envio.
  const blurConfirm = () => {
    if (values.confirmPassword) {
      const { confirmPassword } = validatePasswordForm(values);
      setErrors((current) => ({ ...current, confirmPassword }));
    }
  };

  const submit = useCallback(() => {
    const found = validatePasswordForm(values);
    setSubmitted(true);
    setErrors(found);

    if (found.currentPassword) return currentRef.current?.focus();
    if (found.newPassword) return newRef.current?.focus();
    if (found.confirmPassword) return confirmRef.current?.focus();

    dispatch(userProfileActions.setErrorPassword(null));
    dispatch(
      userProfileActions.changePasswordAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    );
  }, [dispatch, values]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    submit();
  };

  return {
    values,
    isLoading,
    currentError:
      serverField?.field === 'currentPassword' ? serverField.message : errors.currentPassword,
    newError:
      serverField?.field === 'newPassword' ? serverField.message : errors.newPassword,
    confirmError: errors.confirmPassword,
    banner: serverError?.kind === 'banner' ? serverError.message : null,
    currentRef,
    newRef,
    confirmRef,
    changeCurrent: change('currentPassword'),
    changeNew: change('newPassword'),
    changeConfirm: change('confirmPassword'),
    blurConfirm,
    handleSubmit,
    retry: submit,
  };
};
