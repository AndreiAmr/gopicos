import { ApolloProvider } from '@apollo/client/react';
import { PropsWithChildren } from 'react';
import { apolloClient } from '../config/apollo';

export const ApolloClientProvider = ({ children }: PropsWithChildren<{}>) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
