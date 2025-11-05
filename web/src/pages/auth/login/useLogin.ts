import { signInActions } from '@/store/authentication/signIn/signInActions';
import { signInSelectors } from '@/store/authentication/signIn/signInSelectors';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();
  const isLoading = useSelector(signInSelectors.getIsLoadingSignIn);

  const handleConfirm = useCallback(() => {
    dispatch(
      signInActions.getSignInAsync({
        email,
        password,
      })
    );
  }, [dispatch, email, password]);

  const handleEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        handleConfirm();
      }
    },
    [handleConfirm]
  );

  return {
    isLoading,
    handleConfirm,
    email,
    setEmail,
    password,
    setPassword,
    handleEnter,
  };
};
