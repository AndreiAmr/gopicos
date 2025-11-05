import apolloClientInstance from '@models/ApolloClient';

import { IProfile } from './profileTypes';
import { getProfileQuery } from './profileQueries';

const getProfile = async (): Promise<IProfile | null> => {
  const { data } = await apolloClientInstance().query<{
    getProfile: IProfile;
  }>({
    fetchPolicy: 'no-cache',
    query: getProfileQuery,
  });

  return data.getProfile;
};

export const profileRepository = {
  getProfile,
};
