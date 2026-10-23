import { getToken } from '@/utils/session';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { expireSession, isUnauthenticated } from '@/utils/sessionExpiration';

import { GRAPHQL_URL } from './env';

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

// Lê o token a cada requisição: o login acontece depois de o client ser criado.
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Guard global (GP-028): `UNAUTHENTICATED` em qualquer página protegida apaga
// a sessão e vai ao Login, guardando a rota para voltar depois de entrar.
const unauthenticatedLink = onError(({ graphQLErrors }) => {
  if (isUnauthenticated(graphQLErrors)) {
    expireSession(() => apolloClient.clearStore());
  }
});

const apolloClient = new ApolloClient({
  link: unauthenticatedLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export { apolloClient };
