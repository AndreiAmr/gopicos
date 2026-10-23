import { getToken } from '@/utils/session';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { apolloClient };
