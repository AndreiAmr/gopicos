import { getCookie } from '@/utils/cookies';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const token = getCookie('token');

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export { apolloClient };
