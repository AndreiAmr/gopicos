import { ApolloError } from '@apollo/client';

export type ApiErrorInfo = {
  /** `extensions.type` do backend (UNAUTHENTICATED, NOT_FOUND, VALIDATION_ERROR...). */
  type: string | null;
  message: string;
  /** Campo do formulário a que o erro se refere (VALIDATION_ERROR). */
  field: string | null;
  /** Falha de rede/timeout: sem resposta do servidor. */
  network: boolean;
};

/** Normaliza o erro do Apollo no formato que as telas usam. */
export const parseApiError = (error: unknown): ApiErrorInfo => {
  if (error instanceof ApolloError) {
    const first = error.graphQLErrors?.[0];
    const extensions = first?.extensions as
      | { type?: string; field?: string }
      | undefined;
    return {
      type: extensions?.type ?? null,
      message: first?.message ?? error.message,
      field: extensions?.field ?? null,
      network: Boolean(error.networkError) && !error.graphQLErrors?.length,
    };
  }
  return {
    type: null,
    message: error instanceof Error ? error.message : 'Erro desconhecido',
    field: null,
    network: error instanceof TypeError,
  };
};
