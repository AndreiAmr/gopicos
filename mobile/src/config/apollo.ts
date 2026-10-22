import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { Platform } from 'react-native';
import { ELoginErrors } from '../hooks/mutation/login/useLoginMutation';
import { getToken } from '../services/session';
import { API_URL } from '@env';

const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const defaultUri = `http://${defaultHost}:4000`;
const graphqlUri = API_URL || defaultUri;

export type ApiError = {
  type: ELoginErrors | string;
  message: string;
  statusCode: number;
};

type ApolloErrorLike = {
  errors: ApiError[];
};

/**
 * Extrai o erro da API. Erros de rede/timeout não trazem `errors`: devolve
 * `null` (quem chama trata "erro sem ApiError" como falha de conexão).
 */
export const normalizeApolloError = (error: unknown): ApiError | null => {
  if (!error) return null;

  const parsedError = error as Partial<ApolloErrorLike>;

  return parsedError.errors?.[0] ?? null;
};

/** Endpoint GraphQL (também usado pelo envio multipart de fotos). */
export const graphqlEndpoint = `${graphqlUri}/graphql`;

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
});

const authLink = new SetContextLink(async ({ headers }) => {
  const token = await getToken();

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { apolloClient };
