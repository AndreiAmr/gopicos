import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, BackHandler } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../routes/types';
import { useSignupMutation } from '../../../hooks/mutation/signup/useSignupMutation';
import {
  STEP_FIELDS,
  SignupFormData,
  SignupStep,
  signupSchema,
  normalizeEmail,
} from './schemas';
import { EMAIL_TAKEN_MESSAGE, mapSignupError } from './serverErrors';

export const STEP_SUBTITLES: Record<SignupStep, string> = {
  1: 'Seus dados',
  2: 'Seu e-mail',
  3: 'Crie sua senha',
};

export const TOTAL_STEPS = 3;

const announce = (message: string) =>
  AccessibilityInfo.announceForAccessibility(message);

export const useSignup = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState<SignupStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const { mutate, loading } = useSignupMutation();
  const form = useForm<SignupFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(signupSchema) as never,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const {
    control,
    getValues,
    getFieldState,
    trigger,
    setError,
    clearErrors,
    formState,
  } = form;

  const goToLogin = useCallback(
    (accountCreated: boolean) => {
      navigation.replace('Login', {
        email: normalizeEmail(getValues('email')),
        accountCreated,
      });
    },
    [getValues, navigation],
  );

  const goBack = useCallback(() => {
    if (loading) return;
    if (step === 1) {
      navigation.goBack();
      return;
    }
    setBannerMessage(null);
    setStep(prev => (prev - 1) as SignupStep);
  }, [loading, navigation, step]);

  // Botão voltar do Android retorna ao passo anterior.
  useEffect(() => {
    if (step === 1) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [step, goBack]);

  const submit = useCallback(() => {
    const { firstName, lastName, email, password } = getValues();
    setBannerMessage(null);
    announce('Criando sua conta');

    mutate({
      variables: {
        props: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizeEmail(email),
          password,
        },
      },
      onCompleted: () => {
        // Sem login automático (UX-15): volta ao Login com e-mail preenchido.
        form.reset();
        goToLogin(true);
      },
      onError: error => {
        const action = mapSignupError(error);
        if (action.kind === 'emailTaken') {
          setEmailTaken(true);
          setStep(2);
          setError('email', { type: 'server', message: EMAIL_TAKEN_MESSAGE });
          announce('Voltamos ao passo 2: este e-mail já tem cadastro.');
        } else if (action.kind === 'field') {
          setStep(action.step);
          setError(action.field, { type: 'server', message: action.message });
        } else {
          setBannerMessage(action.message);
          announce(action.message);
        }
      },
    });
  }, [form, getValues, goToLogin, mutate, setError]);

  const handleContinue = useCallback(async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) {
      const message = STEP_FIELDS[step]
        .map(name => getFieldState(name).error?.message)
        .find(Boolean);
      if (message) announce(message);
      return;
    }
    if (step < TOTAL_STEPS) {
      const next = (step + 1) as SignupStep;
      setStep(next);
      announce(`Passo ${next} de ${TOTAL_STEPS}: ${STEP_SUBTITLES[next]}`);
      return;
    }
    submit();
  }, [getFieldState, step, submit, trigger]);

  /** Revalida a confirmação quando o campo original muda e ela já foi preenchida. */
  const handleOriginalChange = useCallback(
    (original: 'email' | 'password', confirmation: keyof SignupFormData) => {
      if (original === 'email') {
        setEmailTaken(false);
        clearErrors('email');
      }
      if (getValues(confirmation)) trigger(confirmation);
    },
    [clearErrors, getValues, trigger],
  );

  return {
    control,
    errors: formState.errors,
    step,
    subtitle: STEP_SUBTITLES[step],
    loading,
    emailTaken,
    bannerMessage,
    showPassword,
    toggleShowPassword: () => setShowPassword(v => !v),
    showConfirmPassword,
    toggleShowConfirmPassword: () => setShowConfirmPassword(v => !v),
    handleContinue,
    handleOriginalChange,
    goBack,
    goToLogin: () => goToLogin(false),
    retry: submit,
  };
};
