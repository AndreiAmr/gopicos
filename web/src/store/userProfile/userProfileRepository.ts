import { apolloClient } from '@/config/apollo-client';

import {
  changePasswordMutation,
  meQuery,
  updateProfileMutation,
} from './userProfileQueries';
import {
  IChangePasswordInput,
  IUpdateProfileInput,
  IUserProfile,
} from './userProfileTypes';

const getMe = async (): Promise<IUserProfile> => {
  const { data } = await apolloClient.query<{ me: IUserProfile | null }>({
    query: meQuery,
    fetchPolicy: 'network-only',
  });

  if (!data?.me) throw new Error('Perfil sem dados');

  return data.me;
};

const updateProfile = async (
  props: IUpdateProfileInput,
): Promise<IUserProfile> => {
  const { data } = await apolloClient.mutate<{
    updateProfile: IUserProfile | null;
  }>({
    mutation: updateProfileMutation,
    variables: { props },
  });

  if (!data?.updateProfile) throw new Error('Atualização sem dados');

  return data.updateProfile;
};

const changePassword = async (props: IChangePasswordInput): Promise<void> => {
  await apolloClient.mutate({
    mutation: changePasswordMutation,
    variables: { props },
  });
};

export const userProfileRepository = {
  changePassword,
  getMe,
  updateProfile,
};
