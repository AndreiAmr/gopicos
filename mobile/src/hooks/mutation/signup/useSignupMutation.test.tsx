import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';

import { signupMutation } from './signupMutation';
import { useSignupMutation } from './useSignupMutation';

const variables = {
  props: {
    firstName: 'Marina',
    lastName: 'Souza',
    email: 'marina@exemplo.com',
    password: 'senha-forte-123',
  },
};

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const renderSignup = async (mocks: Mocks) =>
  await renderHook(() => useSignupMutation(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

describe('useSignupMutation', () => {
  it('começa ocioso', async () => {
    const { result } = await renderSignup([]);

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('expõe a mensagem após cadastro com sucesso', async () => {
    const { result } = await renderSignup([
      {
        request: { query: signupMutation, variables },
        result: { data: { signup: { message: 'Usuário criado com sucesso' } } },
      },
    ]);

    await act(async () => {
      await result.current.mutate({ variables });
    });

    await waitFor(() =>
      expect(result.current.data).toEqual({
        message: 'Usuário criado com sucesso',
      }),
    );
  });
});
