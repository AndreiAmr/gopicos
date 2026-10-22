import { userRepository } from '../database/repositories/User';
import { IsUserActive } from './context';

export const isUserActive: IsUserActive = (userId) =>
  userRepository.isActive(userId);
