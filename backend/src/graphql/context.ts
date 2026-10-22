import {
  AuthenticationModel,
  IAuthentication,
} from '../models/authentication/authenticationModel';
import { getTokenData } from '../utils/jwt';

export type ContextType = {
  auth: AuthenticationModel;
};

/**
 * Ponto de extensão para invalidar tokens de usuários desativados (D4).
 * Retorna false quando o usuário não pode mais usar o token.
 * A implementação com o campo de desativação entra no GP-016.
 */
export type IsUserActive = (userId: string) => Promise<boolean>;

const extractBearerToken = (header?: string): string | null => {
  if (!header) return null;

  const [scheme, value, ...rest] = header.trim().split(/\s+/);

  if (rest.length > 0 || scheme?.toLowerCase() !== 'bearer' || !value) {
    return null;
  }

  return value;
};

export const buildContext = async (
  authorizationHeader?: string,
  isUserActive?: IsUserActive,
): Promise<Partial<ContextType>> => {
  const token = extractBearerToken(authorizationHeader);
  if (!token) return {};

  const data = getTokenData(token);
  if (!data || typeof data === 'string') return {};

  const { id, email } = data as Partial<IAuthentication>;
  if (typeof id !== 'string' || !id) return {};

  if (isUserActive && !(await isUserActive(id))) return {};

  return {
    auth: new AuthenticationModel({ id, email: email as string }),
  };
};
