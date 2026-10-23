import { AppError } from '../../utils/AppError';
import { userRepository } from '../../database/repositories/User';
import { getProfileController } from './getProfile.controller';

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
};

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 40;

const invalid = (field: string, message: string) =>
  new AppError({ type: 'VALIDATION_ERROR', message, statusCode: 400, field });

const validateName = (
  field: 'firstName' | 'lastName',
  value: string | undefined,
) => {
  const isFirst = field === 'firstName';
  const label = isFirst ? 'nome' : 'sobrenome';
  const trimmed = value?.trim() ?? '';

  if (!trimmed) {
    throw invalid(field, isFirst ? 'Informe seu nome.' : 'Informe seu sobrenome.');
  }

  if (trimmed.length < NAME_MIN_LENGTH) {
    throw invalid(
      field,
      `O ${label} precisa ter ao menos ${NAME_MIN_LENGTH} caracteres.`,
    );
  }

  if (trimmed.length > NAME_MAX_LENGTH) {
    throw invalid(
      field,
      `O ${label} pode ter no máximo ${NAME_MAX_LENGTH} caracteres.`,
    );
  }

  return trimmed;
};

/** Atualiza nome e sobrenome do usuário do token; e-mail é imutável (D7). */
export const updateProfileController = async (
  userId: string,
  props: UpdateProfileInput,
) => {
  const firstName = validateName('firstName', props.firstName);
  const lastName = validateName('lastName', props.lastName);

  await userRepository.updateById(userId, { firstName, lastName });

  return getProfileController(userId);
};
