import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { Platform } from 'react-native';
import { ELoginErrors } from '../hooks/mutation/login/useLoginMutation';

const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export type ApiError = {
  type: ELoginErrors | string;
  message: string;
  statusCode: number;
};

type ApolloErrorLike = {
  errors: ApiError[];
};

export const normalizeApolloError = (error: unknown): ApiError | null => {
  if (!error) return null;

  const parsedError = error as ApolloErrorLike;

  return parsedError.errors[0];
};

const httpLink = new HttpLink({
  uri: `http://${defaultHost}:4000/graphql`,
  // headers: {
  //   Authorization: token ? `Bearer ${token}` : '',
  // },
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export { apolloClient };
