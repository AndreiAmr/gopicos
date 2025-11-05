import { ChangeEvent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const defaultValues = {
  email: '',
  password: '',
};

export const useLoginTemplate = () => {
  const router = useRouter();

  const form = useForm<ILoginForm>({ defaultValues });

  const email = form.watch('email');
  const password = form.watch('password');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue(e.target.name as keyof typeof defaultValues, e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/home');
    }
  }, [email, password, router]);

  return { email, password, handleChange, handleSubmit };
};
