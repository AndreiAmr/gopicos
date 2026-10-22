import { getProfileService } from '../../services/user/getProfile.service';

/** Perfil do usuário logado; nunca expõe a senha. */
export const getProfileController = async (userId: string) => {
  const user = await getProfileService(userId);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
