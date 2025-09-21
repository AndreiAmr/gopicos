import { ApolloError } from '@apollo/client';

export const getGraphQLError = (error?: ApolloError) => {
  const firstError = error?.graphQLErrors[0];

  console.log('🚀 ~ getGraphQLError ~ firstError:', firstError);

  if (!firstError) return;

  return firstError.message;
};
