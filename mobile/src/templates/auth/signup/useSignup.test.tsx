import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';
import { GraphQLError } from 'graphql';

import { signupMutation } from '../../../hooks/mutation/signup/signupMutation';
import { useSignup } from './useSignup';

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
}));

const props = {
  firstName: 'Marina',
  lastName: 'Souza',
  email: 'marina@exemplo.com',
  password: 'senha-forte-123',
};

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const setup = async (mocks: Mocks = []) =>
  await renderHook(() => useSignup(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

type Hook = Awaited<ReturnType<typeof setup>>;

const fill = async ({ result }: Hook, values: Record<string, string>) => {
  for (const [name, value] of Object.entries(values)) {
    await act(async () => {
      result.current.setValue(name as never, value as never);
    });
  }
};

describe('useSignup', () => {
  beforeEach(() => jest.clearAllMocks());

  it('não avança do passo 1 com campos inválidos e mostra os erros', async () => {
    const hook = await setup();

    await act(async () => {
      await hook.result.current.handleContinue();
    });

    expect(hook.result.current.step).toBe(1);
    expect(hook.result.current.errors.firstName?.message).toBe(
      'Informe seu nome.',
    );
  });

  it('avança entre passos e volta preservando os dados', async () => {
    const hook = await setup();
    await fill(hook, { firstName: 'Marina', lastName: 'Souza' });

    await act(async () => {
      await hook.result.current.handleContinue();
    });
    expect(hook.result.current.step).toBe(2);

    act(() => hook.result.current.goBack());
    expect(hook.result.current.step).toBe(1);
    expect(hook.result.current.getValues().firstName).toBe('Marina');
  });

  it('cria a conta e volta ao Login com o e-mail preenchido', async () => {
    const hook = await setup([
      {
        request: { query: signupMutation, variables: { props } },
        result: { data: { signup: { message: 'ok' } } },
      },
    ]);
    await fill(hook, {
      ...props,
      confirmEmail: props.email,
      confirmPassword: props.password,
    });

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await hook.result.current.handleContinue();
      });
    }

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('Login', {
        email: 'marina@exemplo.com',
        accountCreated: true,
      }),
    );
  });

  it('EMAIL_ALREADY_EXISTS volta ao passo 2 com erro no e-mail', async () => {
    const hook = await setup([
      {
        request: { query: signupMutation, variables: { props } },
        result: {
          errors: [
            new GraphQLError('Email já cadastrado', {
              extensions: { type: 'EMAIL_ALREADY_EXISTS' },
            }),
          ],
        },
      },
    ]);
    await fill(hook, {
      ...props,
      confirmEmail: props.email,
      confirmPassword: props.password,
    });
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await hook.result.current.handleContinue();
      });
    }

    await waitFor(() => expect(hook.result.current.step).toBe(2));
    expect(hook.result.current.emailTaken).toBe(true);
    expect(hook.result.current.errors.email?.message).toBe(
      'Este e-mail já tem cadastro.',
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
