import { ContextType } from '../../../context';
import {
  UpdateProfileInput,
  updateProfileController,
} from '../../../../controllers/user/updateProfile.controller';

export const updateProfileResolvers = {
  Mutation: {
    updateProfile: (
      _: unknown,
      args: { props: UpdateProfileInput },
      context: ContextType,
    ) => updateProfileController(context.auth.id, args.props),
  },
};
