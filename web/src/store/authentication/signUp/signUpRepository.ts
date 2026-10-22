import { apolloClient } from '@/config/apollo-client';

import { signUpMutation } from './signUpMutation';
import { ISignUpValues } from './signUpTypes';

type SignUpInput = Pick<
  ISignUpValues,
  'firstName' | 'lastName' | 'email' | 'password'
>;

const signUp = async ({
  firstName,
  lastName,
  email,
  password,
}: SignUpInput): Promise<string | null> => {
  const { data } = await apolloClient.mutate<{
    signup: { message: string | null } | null;
  }>({
    mutation: signUpMutation,
    variables: {
      props: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      },
    },
  });

  return data?.signup?.message ?? null;
};

export const signUpRepository = {
  signUp,
};
