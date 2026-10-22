import { useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useForm, type Resolver } from 'react-hook-form';

import { signUpActions } from '@/store/authentication/signUp/signUpActions';
import { FIELD_STEP, STEP_URL } from '@/store/authentication/signUp/signUpErrors';
import { stepSchemas } from '@/store/authentication/signUp/signUpSchemas';
import { signUpSelectors } from '@/store/authentication/signUp/signUpSelectors';
import type {
  ISignUpValues,
  SignUpField,
  SignUpStep,
} from '@/store/authentication/signUp/signUpTypes';

const CONFIRMATION_OF: Partial<Record<SignUpField, SignUpField>> = {
  email: 'emailConfirm',
  password: 'passwordConfirm',
};

/**
 * Formulario de um passo do cadastro. Valida no blur (e a cada digitacao depois
 * do primeiro erro), guarda os valores no Redux ao avancar/voltar e mostra o
 * erro vindo do servidor no campo correspondente.
 */
export const useSignUpStep = <F extends SignUpField>(
  step: SignUpStep,
  fields: readonly F[]
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const values = useSelector(signUpSelectors.getSignUpValues);
  const isLoading = useSelector(signUpSelectors.getIsLoadingSignUp);
  const serverError = useSelector(signUpSelectors.getSignUpFieldError);
  const bannerError = useSelector(signUpSelectors.getSignUpBannerError);
  const canRetry = useSelector(signUpSelectors.getSignUpCanRetry);

  type StepValues = Pick<ISignUpValues, F>;

  const defaultValues = Object.fromEntries(
    fields.map((field) => [field, values[field]])
  ) as StepValues;

  const form = useForm<StepValues>({
    resolver: yupResolver(stepSchemas[step] as never) as unknown as Resolver<StepValues>,
    mode: 'onTouched',
    defaultValues: defaultValues as never,
  });

  const { setFocus, getValues, trigger, handleSubmit, register, formState } =
    form;

  const activeServerError =
    serverError && FIELD_STEP[serverError.field] === step ? serverError : null;

  // Erro do servidor: foca o campo para o leitor de tela anunciar.
  useEffect(() => {
    if (activeServerError) {
      setFocus(activeServerError.field as never);
    }
  }, [activeServerError, setFocus]);

  const errorFor = (field: F): string | undefined => {
    const clientError = formState.errors[field as keyof typeof formState.errors];
    if (clientError?.message) return String(clientError.message);
    return activeServerError?.field === field
      ? activeServerError.message
      : undefined;
  };

  const field = (name: F) => {
    const registered = register(name as never);

    return {
      ...registered,
      error: errorFor(name),
      readOnly: isLoading,
      onChange: async (event: unknown) => {
        if (activeServerError?.field === name) {
          dispatch(signUpActions.setSignUpFieldError(null));
        }
        await registered.onChange(event as never);

        const confirmation = CONFIRMATION_OF[name];
        if (
          confirmation &&
          (fields as readonly SignUpField[]).includes(confirmation) &&
          getValues(confirmation as never)
        ) {
          await trigger(confirmation as never);
        }
      },
    };
  };

  const persist = useCallback(
    (data: Partial<ISignUpValues>) => {
      dispatch(signUpActions.saveSignUpValues(data));
    },
    [dispatch]
  );

  const goBack = () => {
    persist(getValues() as Partial<ISignUpValues>);
    // Cada passo e uma entrada de historico; sem historico, vai direto.
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(STEP_URL[(step - 1) as SignUpStep], { replace: true });
    }
  };

  const onValid = (onSuccess: (data: StepValues) => void) =>
    handleSubmit((data) => {
      persist(data as Partial<ISignUpValues>);
      onSuccess(data as StepValues);
    });

  const goNext = onValid(() => {
    navigate(STEP_URL[(step + 1) as SignUpStep]);
  });

  const submit = onValid((data) => {
    dispatch(
      signUpActions.submitSignUpAsync({
        ...values,
        ...(data as Partial<ISignUpValues>),
      })
    );
  });

  return {
    field,
    goBack,
    goNext,
    submit,
    isLoading,
    bannerError,
    canRetry,
    serverError: activeServerError,
    getValues,
  };
};
