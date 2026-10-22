export const DEACTIVATED_USER_NAME = 'Usuário Desativado';

type PublicNameSource = {
  firstName: string;
  lastName?: string | null;
  deactivatedAt?: Date | null;
};

/**
 * Nome público (D36): "Nome S." (primeiro nome + inicial do sobrenome).
 * Sem sobrenome, só o nome; conta desativada vira "Usuário Desativado".
 */
export const displayName = (user: PublicNameSource): string => {
  if (user.deactivatedAt) return DEACTIVATED_USER_NAME;

  const first = user.firstName.trim().split(/\s+/)[0] ?? '';
  const initial = user.lastName?.trim().charAt(0).toUpperCase();

  return initial ? `${first} ${initial}.` : first;
};
