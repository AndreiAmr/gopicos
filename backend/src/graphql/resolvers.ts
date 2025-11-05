import { loginResolvers } from './modules/authentication/login/resolver';
import { signupResolvers } from './modules/authentication/signup/resolver';
import { fowardGeocodingResolvers } from './modules/geocoding/foward/resolver';
import { reverseGeocodingResolvers } from './modules/geocoding/reverse/resolver';

import { spotResolvers } from './modules/spot/resolver';
import { spotDetailsResolver } from './modules/spot/spotDetails/resolver';

export const resolvers = {
  Query: {
    ...spotResolvers.Query,
    ...fowardGeocodingResolvers.Queries,
    ...spotDetailsResolver.Query,
    ...reverseGeocodingResolvers.Query,
  },
  Mutation: {
    ...loginResolvers.Mutation,
    ...signupResolvers.Mutation,
    ...spotResolvers.Mutation,
  },
};
