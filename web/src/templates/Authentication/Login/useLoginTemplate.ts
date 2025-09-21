import { ILoginData, loginMutation } from '@/repository/auth/loginMutation';
import { getGraphQLError } from '@/utils/errors';
import { useMutation } from '@apollo/client';

import { ChangeEvent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import mixpanel from 'mixpanel-browser';

const defaultValues = {
  email: '',
  password: '',
};

export const useLoginTemplate = () => {
  const router = useRouter();
  const [requestLogin, { error }] = useMutation<ILoginData>(loginMutation);
  console.log('🚀 ~ useLoginTemplate ~ error:', error);

  const form = useForm<ILoginForm>({ defaultValues });

  const email = form.watch('email');
  const password = form.watch('password');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue(e.target.name as keyof typeof defaultValues, e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const loadingToast = toast.loading('Carregando...');
    try {
      const result = await requestLogin({
        variables: {
          prop: {
            email,
            password,
          },
        },
      });

      const { data } = result;

      const token = data?.login.token;

      if (!token) {
        toast.error('Não foi possível resgatar seu token');
        return;
      }

      const expiresDate = new Date(data.login.exp * 1000);

      Cookies.set('token', JSON.stringify(data.login), {
        expires: expiresDate,
      });

      toast.dismiss(loadingToast);
      toast.success('Bem vindo de volta!');

      mixpanel.identify(data.login.id);

      mixpanel.people.set({
        $name: result.data?.login.name,
        $email: result.data?.login.name,
      });

      mixpanel.track('Logged in', {
        token: token,
      });

      router.push('/home');
    } catch (err: unknown) {
      toast.dismiss();
      toast.error(getGraphQLError(err as any));
    }
  }, [email, password, error, requestLogin, getGraphQLError]);

  return { email, password, handleChange, handleSubmit };
};
