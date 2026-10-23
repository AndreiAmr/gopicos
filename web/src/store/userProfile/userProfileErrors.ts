import { ApolloError } from '@apollo/client';

import type {
  UserProfileLoadError,
  UserProfileOperationError,
} from './userProfileTypes';

export const NETWORK_MESSAGE =
  'Sem conexão. Verifique sua internet e tente de novo.';
export const SERVER_MESSAGE =
  'Algo deu errado do nosso lado. Tente de novo em instantes.';

type ApiErrorInfo = { type?: string; field?: string; message?: string };

const apiError = (error: unknown): ApiErrorInfo | null => {
  if (!(error instanceof ApolloError)) return null;
  const first = error.graphQLErrors?.[0];
  if (!first) return null;
  return {
    type: first.extensions?.type as string | undefined,
    field: first.extensions?.field as string | undefined,
    message: first.message,
  };
};

const isNetwork = (error: unknown): boolean => {
  if (error instanceof ApolloError) {
    return Boolean(error.networkError) && !error.graphQLErrors?.length;
  }
  // fetch sem resposta chega como TypeError ("Failed to fetch")
  return error instanceof TypeError;
};

/** Sessão inválida ou expirada: a tela deve levar ao Login. */
export const isUnauthenticated = (error: unknown): boolean =>
  apiError(error)?.type === 'UNAUTHENTICATED';

export const classifyLoadError = (error: unknown): UserProfileLoadError =>
  isNetwork(error) ? 'network' : 'server';

/**
 * Converte o erro de uma operação de escrita. `fieldMap` diz quais `field` do
 * servidor viram erro de campo; `invalidCredentialsField` marca o campo da
 * senha quando o servidor devolve INVALID_CREDENTIALS (a pessoa já está logada,
 * então não há o que proteger, UX-P11).
 */
export const classifyOperationError = (
  error: unknown,
  options: {
    fields?: string[];
    invalidCredentials?: { field: string; message: string };
  } = {},
): UserProfileOperationError => {
  const info = apiError(error);

  if (!info) {
    return {
      kind: 'banner',
      message: isNetwork(error) ? NETWORK_MESSAGE : SERVER_MESSAGE,
    };
  }

  if (info.type === 'INVALID_CREDENTIALS' && options.invalidCredentials) {
    return { kind: 'field', ...options.invalidCredentials };
  }

  if (info.type === 'VALIDATION_ERROR' && info.message) {
    if (info.field && options.fields?.includes(info.field)) {
      return { kind: 'field', field: info.field, message: info.message };
    }
    return { kind: 'banner', message: info.message };
  }

  return { kind: 'banner', message: SERVER_MESSAGE };
};
