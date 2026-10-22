import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { Platform } from 'react-native';
import { ELoginErrors } from '../hooks/mutation/login/useLoginMutation';
import * as Keychain from 'react-native-keychain';

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

  const parsedError = (error as ApolloErrorLike) || {};

  if (!parsedError?.errors?.length) return null;

  return parsedError.errors[0];
};

const httpLink = new HttpLink({
  uri: `http://${defaultHost}:4000/graphql`,
});

const authLink = new SetContextLink(async prevContext => {
  let token: string | null = null;
  try {
    const credentials = await Keychain.getGenericPassword();
    token = credentials ? credentials.password : null;
  } catch (e) {
    console.warn('Failed to read token from Keychain', e);
  }

  return {
    headers: {
      ...prevContext.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export { apolloClient };
