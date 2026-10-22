import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, TextInput } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useLoginMutation } from '../../../hooks/mutation/login/useLoginMutation';
import { normalizeApolloError } from '../../../config/apollo';
import { clearSession, saveSession } from '../../../services/session';
import { useToast } from '../../../atomic/ds';
import type { RootStackParamList } from '../../../routes/types';
import {
  LoginFailure,
  LoginFormData,
  classifyLoginError,
  failureMessage,
  loginSchema,
  loginStrings,
} from './logic';

export const useLogin = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Login'>>();
  const toast = useToast();
  const { mutate } = useLoginMutation();

  const passwordRef = useRef<TextInput>(null);
  const [failure, setFailure] = useState<LoginFailure | null>(null);
  // Fica true até a navegação para o formulário não "piscar" no sucesso.
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: { email: params?.email ?? '', password: '' },
    resolver: yupResolver(loginSchema),
    // Valida ao sair do campo; depois do primeiro erro, a cada digitação.
    mode: 'onTouched',
  });

  // Sessão expirada: garante que o token vencido saia do Keychain.
  const expired = params?.notice === 'sessionExpired';
  useEffect(() => {
    if (expired) {
      clearSession().catch(() => undefined);
    }
  }, [expired]);

  const fail = useCallback((reason: LoginFailure) => {
    setFailure(reason);
    setSubmitting(false);
    AccessibilityInfo.announceForAccessibility(failureMessage(reason));
  }, []);

  const onValid = useCallback(
    async ({ email, password }: LoginFormData) => {
      setFailure(null);
      setSubmitting(true);
      AccessibilityInfo.announceForAccessibility(loginStrings.signingIn);

      let login;
      try {
        const result = await mutate({
          variables: { props: { email, password } },
        });
        login = result.data?.login;
      } catch (error) {
        const reason = classifyLoginError(normalizeApolloError(error));
        fail(reason);
        if (reason === 'credentials') {
          // Senha permanece e volta o foco para trocá-la rápido.
          passwordRef.current?.focus();
          passwordRef.current?.setSelection?.(0, password.length);
        }
        return;
      }

      if (!login) {
        fail('server');
        return;
      }

      try {
        await saveSession({
          token: login.token,
          exp: login.exp,
          id: login.id,
          name: login.name,
          email: login.email,
        });
      } catch {
        fail('server');
        return;
      }

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

      if (login.reactivated) {
        toast.show({ type: 'success', message: loginStrings.reactivated });
      }
    },
    [mutate, fail, navigation, toast],
  );

  const handleLogin = form.handleSubmit(onValid);

  // Rota `Signup` é registrada pelo cadastro mobile (#25 / PR #113).
  const goToSignup = useCallback(
    () => navigation.navigate('Signup'),
    [navigation],
  );

  return {
    control: form.control,
    errors: form.formState.errors,
    handleLogin,
    goToSignup,
    submitting,
    failure,
    failureMessage: failure ? failureMessage(failure) : null,
    passwordRef,
    notice: params?.notice,
  };
};
