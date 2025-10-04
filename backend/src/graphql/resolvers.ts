import { loginResolvers } from './modules/authentication/login/resolver';
import { signupResolvers } from './modules/authentication/signup/resolver';
import { fowardGeocodingResolvers } from './modules/geocoding/foward/resolver';
import { locationMarkingTypeResolvers } from './modules/spot/locationMarkingType/resolver';
import { spotResolvers } from './modules/spot/resolver';

export const resolvers = {
  Query: {
    ...spotResolvers.Query,
    ...locationMarkingTypeResolvers.Query,
    ...fowardGeocodingResolvers.Queries,
  },
  Mutation: {
    ...loginResolvers.Mutation,
    ...signupResolvers.Mutation,
    ...spotResolvers.Mutation,
  },
};
