import { createApolloServer } from '../graphql/server';
import { buildContext } from '../graphql/context';
import { isUserActive } from '../graphql/isUserActive';

const server = createApolloServer();

type ExecuteOptions = {
  variables?: Record<string, unknown>;
  /** JWT puro (sem o prefixo "Bearer "). Omitido = requisição anônima. */
  token?: string;
};

export type GraphQLTestError = {
  message: string;
  extensions?: { type?: string; statusCode?: number; field?: string };
};

/** Executa uma operação GraphQL contra o Apollo Server, sem subir HTTP. */
export const executeOperation = async <TData = any>(
  query: string,
  { variables, token }: ExecuteOptions = {},
) => {
  const contextValue = await buildContext(
    token ? `Bearer ${token}` : undefined,
    isUserActive,
  );

  const response = await server.executeOperation(
    { query, variables },
    { contextValue },
  );

  if (response.body.kind !== 'single') {
    throw new Error('Resposta incremental não suportada nos testes');
  }

  const { data, errors } = response.body.singleResult;

  return {
    data: (data ?? null) as TData | null,
    errors: errors as unknown as GraphQLTestError[] | undefined,
  };
};

export const executeAnonymous = <TData = any>(
  query: string,
  variables?: Record<string, unknown>,
) => executeOperation<TData>(query, { variables });

export const executeAuthenticated = <TData = any>(
  token: string,
  query: string,
  variables?: Record<string, unknown>,
) => executeOperation<TData>(query, { variables, token });
