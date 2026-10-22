import { ContextType } from '../../../context';
import { getProfileController } from '../../../../controllers/user/getProfile.controller';

const profileResolver = (_: unknown, __: unknown, context: ContextType) =>
  getProfileController(context.auth.id);

export const profileResolvers = {
  Query: {
    me: profileResolver,
    getProfile: profileResolver,
  },
};
