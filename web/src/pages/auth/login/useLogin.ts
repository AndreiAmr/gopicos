import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { signInActions } from '@/store/authentication/signIn/signInActions';
import { signInSelectors } from '@/store/authentication/signIn/signInSelectors';

import { validateLogin, type LoginFieldErrors } from './loginValidation';

export const useLogin = () => {
  const location = useLocation();
  const navState = location.state as {
    from?: string;
    email?: string;
    accountCreated?: boolean;
    sessionExpired?: boolean;
    accountDeleted?: boolean;
  } | null;
  const accountCreated = Boolean(navState?.accountCreated);
  const sessionExpired = Boolean(navState?.sessionExpired);
  const accountDeleted = Boolean(navState?.accountDeleted);

  const [email, setEmail] = useState<string>(navState?.email ?? '');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const isLoading = useSelector(signInSelectors.getIsLoadingSignIn);
  const error = useSelector(signInSelectors.getErrorSignIn);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Rota pretendida guardada pelo guard (GP-028) em location.state.from
  const redirectTo = navState?.from ?? null;

  // Vindo do cadastro (ou do e-mail duplicado) o e-mail já vem preenchido: foca a senha
  useEffect(() => {
    if (navState?.email) passwordRef.current?.focus();
  }, [navState?.email]);

  const submit = useCallback(() => {
    const errors = validateLogin(email, password);
    setSubmitted(true);
    setFieldErrors(errors);

    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();

    dispatch(signInActions.setErrorSignIn(null));
    dispatch(
      signInActions.getSignInAsync(
        { email: email.trim(), password },
        redirectTo
      )
    );
  }, [dispatch, email, password, redirectTo]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isLoading) return;
      submit();
    },
    [isLoading, submit]
  );

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (submitted) setFieldErrors(validateLogin(value, password));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (submitted) setFieldErrors(validateLogin(email, value));
  };

  // Credenciais inválidas: foca a senha e seleciona o texto para trocar rápido
  const focusPasswordOnInvalid = useCallback(() => {
    passwordRef.current?.focus();
    passwordRef.current?.select();
  }, []);

  return {
    isLoading,
    error,
    accountCreated,
    sessionExpired,
    accountDeleted,
    email,
    password,
    showPassword,
    fieldErrors,
    emailRef,
    passwordRef,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    toggleShowPassword: () => setShowPassword((v) => !v),
    retry: submit,
    focusPasswordOnInvalid,
  };
};
