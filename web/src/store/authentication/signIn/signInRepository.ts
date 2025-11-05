import { apolloClient } from '@/config/apollo-client';

import { signInMutation } from './signInMutation';
import { ISignUpCredentials } from './signInTypes';
import { IProfile } from '@/store/profile/profileTypes';

const getSignIn = async ({
  email,
  password,
}: ISignUpCredentials): Promise<IProfile | null> => {
  const { data } = await apolloClient.mutate<{
    login: IProfile;
  }>({
    mutation: signInMutation,
    variables: {
      props: {
        email,
        password,
      },
    },
  });

  return data?.login || null;
};

export const signInRepository = {
  getSignIn,
};
