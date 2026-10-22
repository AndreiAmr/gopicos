import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { describe, expect, it } from 'vitest';

import { classifySignInError } from './signInErrors';

describe('classifySignInError', () => {
  it('INVALID_CREDENTIALS vira invalid_credentials', () => {
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('x', { extensions: { type: 'INVALID_CREDENTIALS' } }),
      ],
    });
    expect(classifySignInError(error)).toBe('invalid_credentials');
  });

  it('falha de rede vira network', () => {
    const error = new ApolloError({ networkError: new Error('offline') });
    expect(classifySignInError(error)).toBe('network');
    expect(classifySignInError(new TypeError('Failed to fetch'))).toBe('network');
  });

  it('outros erros viram server', () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError('x', { extensions: { type: 'INTERNAL' } })],
    });
    expect(classifySignInError(error)).toBe('server');
    expect(classifySignInError(new Error('boom'))).toBe('server');
  });
});
