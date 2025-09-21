import { loginResolvers } from './modules/authentication/login/resolver';
import { signupResolvers } from './modules/authentication/signup/resolver';
import { locationMarkingTypeResolvers } from './modules/spot/locationMarkingType/resolver';
import { spotResolvers } from './modules/spot/resolver';

export const resolvers = {
  Query: {
    ...spotResolvers.Query,
    ...locationMarkingTypeResolvers.Query,
  },
  Mutation: {
    ...loginResolvers.Mutation,
    ...signupResolvers.Mutation,
    ...spotResolvers.Mutation,
  },
};
