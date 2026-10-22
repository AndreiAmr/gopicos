import { fullName } from '../../utils/fullName';
import { getProfileService } from '../../services/user/getProfile.service';

/** Perfil do usuário logado; nunca expõe a senha. */
export const getProfileController = async (userId: string) => {
  const user = await getProfileService(userId);

  return {
    id: user.id,
    name: fullName(user),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
