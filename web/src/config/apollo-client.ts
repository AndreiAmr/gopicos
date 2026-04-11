import { onError } from '@apollo/client/link/error';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await window.cookieStore.get('token');

  return {
    headers: {
      ...headers,
      authorization: token?.value ? `Bearer ${token.value}` : '',
    },
  };
});

const errorLink = onError((error) => {
  if (error.graphQLErrors) {
    const isUnauthorized = error.graphQLErrors.some(
      (err) =>
        err.extensions?.statusCode === 401 ||
        err.extensions?.code === 'UNAUTHENTICATED',
    );

    if (isUnauthorized) {
      window.location.replace('/');
    }
  }
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  // link: authLink.concat(httpLink).concat(errorLink),
  cache: new InMemoryCache(),
});

export { apolloClient };
