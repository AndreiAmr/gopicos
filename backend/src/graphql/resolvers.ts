import { loginResolvers } from './modules/authentication/login/resolver';
import { requestPasswordResetResolvers } from './modules/authentication/requestPasswordReset/resolver';
import { resetPasswordResolvers } from './modules/authentication/resetPassword/resolver';
import { signupResolvers } from './modules/authentication/signup/resolver';
import { fowardGeocodingResolvers } from './modules/geocoding/foward/resolver';
import { reverseGeocodingResolvers } from './modules/geocoding/reverse/resolver';

import { deleteAccountResolvers } from './modules/user/deleteAccount/resolver';
import { changePasswordResolvers } from './modules/user/changePassword/resolver';
import { updateProfileResolvers } from './modules/user/updateProfile/resolver';
import { myActivityResolvers } from './modules/user/myActivity/resolver';
import { profileResolvers } from './modules/user/profile/resolver';
import { spotResolvers } from './modules/spot/resolver';
import { spotDetailsResolver } from './modules/spot/spotDetails/resolver';
import { listSpotReviewsResolver } from './modules/spot/listSpotReviews/resolver';

export const resolvers = {
  Query: {
    ...spotResolvers.Query,
    ...fowardGeocodingResolvers.Queries,
    ...spotDetailsResolver.Query,
    ...listSpotReviewsResolver.Query,
    ...reverseGeocodingResolvers.Query,
    ...profileResolvers.Query,
    ...myActivityResolvers.Query,
  },
  Mutation: {
    ...loginResolvers.Mutation,
    ...signupResolvers.Mutation,
    ...requestPasswordResetResolvers.Mutation,
    ...resetPasswordResolvers.Mutation,
    ...spotResolvers.Mutation,
    ...deleteAccountResolvers.Mutation,
    ...changePasswordResolvers.Mutation,
    ...updateProfileResolvers.Mutation,
  },
  SpotAuthor: spotDetailsResolver.SpotAuthor,
};
