import { SubmitHandler, useForm } from 'react-hook-form';
import { useLoginMutation } from '../../../hooks/mutation/login/useLoginMutation';
import { useCallback, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorContentProps, getErrorContent } from './constants';
import { BottomSheetModal as GorhomBottomSheetModal } from '@gorhom/bottom-sheet';
import { normalizeApolloError } from '../../../config/apollo';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../routes/types';

import * as yup from 'yup';

const validationSchema = yup
  .object({
    email: yup.string().email('Email inválido').required('Campo obrigatório'),
    password: yup.string().required('Campo obrigatório'),
  })
  .required();

type LoginFormData = yup.InferType<typeof validationSchema>;

export const useLogin = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showPassword, setShowPassword] = useState(false);
  const [errorContent, setErrorContent] = useState<ErrorContentProps | null>(
    null,
  );
  const ref = useRef<GorhomBottomSheetModal>(null);

  const { mutate, loading } = useLoginMutation();
  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onChange',
  });

  const handleLogin = useCallback<SubmitHandler<LoginFormData>>(
    props => {
      mutate({
        variables: {
          props,
        },
        onError: apolloError => {
          const parsedError = normalizeApolloError(apolloError);

          setErrorContent(getErrorContent(parsedError?.type));
          ref.current?.present();
        },
        onCompleted: () => {
          setErrorContent(null);
          ref.current?.close();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
      });
    },
    [mutate, navigation],
  );

  const handleCloseModal = useCallback(() => {
    ref.current?.close();
  }, []);

  return {
    errors: formState.errors,
    control,
    showPassword,
    setShowPassword,
    handleLogin: handleSubmit(handleLogin),
    loading,
    ref,
    errorContent,
    handleCloseModal,
  };
};
