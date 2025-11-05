import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cookies } from 'next/headers';

export const getServerApolloClient = async (token?: string) => {
  // const token = (await cookies()).get('token');

  const httpLink = createHttpLink({
    uri: process.env.API_URL || 'http://localhost:4000/graphql',
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    console.log('🚀 ~ getServerApolloClient ~ token.value:', token);
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
