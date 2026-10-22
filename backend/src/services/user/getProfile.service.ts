import { userRepository } from '../../database/repositories/User';
import { AppError } from '../../utils/AppError';

export const getProfileService = async (userId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError({
      type: 'USER_NOT_FOUND',
      message: 'Usuário não encontrado',
      statusCode: 404,
    });
  }

  return user;
};
