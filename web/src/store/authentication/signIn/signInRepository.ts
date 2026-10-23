import { apolloClient } from '@/config/apollo-client';

import { signInMutation } from './signInMutation';
import { ISignUpCredentials } from './signInTypes';
import { IProfile } from '@/store/profile/profileTypes';

const getSignIn = async ({
  email,
  password,
}: ISignUpCredentials): Promise<IProfile> => {
  const { data } = await apolloClient.mutate<{
    login: IProfile | null;
  }>({
    mutation: signInMutation,
    variables: {
      props: {
        email,
        password,
      },
    },
  });

  if (!data?.login) throw new Error('Login sem dados');

  return data.login;
};

export const signInRepository = {
  getSignIn,
};
