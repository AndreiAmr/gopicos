import { useMutation } from '@apollo/client/react';
import { loginMutation } from './loginMutation';
import { normalizeApolloError } from '../../../config/apollo';

export enum ELoginErrors {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export const useLoginMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(loginMutation, {
    fetchPolicy: 'no-cache',
  });

  const mutationError = normalizeApolloError(error);

  return {
    mutate,
    data: data?.login,
    loading,
    error: mutationError,
  };
};
// {"errors":[{"message":"Email e senha são obrigatórios","type":"VALIDATION_ERROR","statusCode":400}],"data":{"login":null},"name":"CombinedGraphQLErrors"}@
