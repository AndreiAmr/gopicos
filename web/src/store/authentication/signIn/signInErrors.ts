import { ApolloError } from '@apollo/client';

import type { SignInErrorType } from './signInTypes';

/**
 * Classifica a falha do login. O backend sempre devolve INVALID_CREDENTIALS
 * tanto para e-mail inexistente quanto para senha errada.
 */
export const classifySignInError = (error: unknown): SignInErrorType => {
  if (error instanceof ApolloError) {
    const type = error.graphQLErrors?.[0]?.extensions?.type;
    if (type === 'INVALID_CREDENTIALS') return 'invalid_credentials';
    if (error.networkError && !error.graphQLErrors?.length) return 'network';
    return 'server';
  }
  // fetch/axios sem resposta chegam como TypeError ("Failed to fetch")
  if (error instanceof TypeError) return 'network';
  return 'server';
};

export const SIGN_IN_ERROR_MESSAGES: Record<SignInErrorType, string> = {
  invalid_credentials: 'E-mail ou senha inválidos',
  network: 'Sem conexão. Verifique sua internet e tente de novo.',
  server: 'Algo deu errado do nosso lado. Tente de novo em instantes.',
};
