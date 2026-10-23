import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useEditProfile } from './useEditProfile';

const mockGoBack = jest.fn();
const mockAddListener = jest.fn(() => jest.fn());
const mockToast = jest.fn();
const mockMutate = jest.fn();
const mockResetToLogin = jest.fn();

const profile = {
  id: '1',
  name: 'Ana Lima',
  firstName: 'Ana',
  lastName: 'Lima',
  email: 'ana@test.com',
  createdAt: '2026-10-22T00:00:00.000Z',
  spotsCount: 0,
  reviewsCount: 0,
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    addListener: mockAddListener,
    dispatch: jest.fn(),
  }),
}));
jest.mock('../../../../atomic/ds', () => ({
  useToast: () => ({ show: mockToast }),
}));
jest.mock('../../../../hooks/query/profile/useProfile', () => ({
  useProfile: () => ({ profile, loading: false }),
}));
jest.mock(
  '../../../../hooks/mutation/updateProfile/useUpdateProfileMutation',
  () => ({
    useUpdateProfileMutation: () => ({ mutate: mockMutate, loading: false }),
  }),
);
jest.mock('../../../../routes/navigationRef', () => ({
  resetToLogin: (p: unknown) => mockResetToLogin(p),
}));

const render = async () => {
  const hook = await renderHook(() => useEditProfile());
  return hook;
};

const type = async (
  hook: Awaited<ReturnType<typeof render>>,
  firstName: string,
  lastName = 'Lima',
) => {
  await act(async () => {
    hook.result.current.control._formValues.firstName = firstName;
    hook.result.current.control._formValues.lastName = lastName;
    await hook.result.current.handleSave();
  });
};

beforeEach(() => jest.clearAllMocks());

describe('useEditProfile', () => {
  it('começa sem mudanças (salvar desabilitado) com o e-mail do perfil', async () => {
    const { result } = await render();
    await waitFor(() => expect(result.current.canSave).toBe(false));
    expect(result.current.email).toBe('ana@test.com');
    expect(result.current.ready).toBe(true);
  });

  it('sucesso: salva aparado, mostra o toast e volta ao perfil', async () => {
    mockMutate.mockResolvedValue({ data: {} });
    const hook = await render();
    await type(hook, ' Anna ');

    expect(mockMutate).toHaveBeenCalledWith({
      variables: { props: { firstName: 'Anna', lastName: 'Lima' } },
    });
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', message: 'Perfil atualizado.' }),
    );
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('nome inválido não chama o servidor', async () => {
    const hook = await render();
    await type(hook, 'A');

    expect(mockMutate).not.toHaveBeenCalled();
    expect(hook.result.current.errors.firstName?.message).toMatch(/ao menos 2/);
  });

  it('erro de rede mostra o banner e mantém na tela', async () => {
    mockMutate.mockRejectedValue({ networkError: {} });
    const hook = await render();
    await type(hook, 'Anna');

    expect(hook.result.current.banner).toMatch(/conexão/);
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('VALIDATION_ERROR com field mostra no campo', async () => {
    mockMutate.mockRejectedValue({
      errors: [
        {
          message: 'O nome pode ter no máximo 40 caracteres.',
          extensions: { type: 'VALIDATION_ERROR', field: 'firstName' },
        },
      ],
    });
    const hook = await render();
    await type(hook, 'Anna');

    expect(hook.result.current.errors.firstName?.message).toMatch(/máximo/);
  });

  it('UNAUTHENTICATED leva ao Login com sessão expirada', async () => {
    mockMutate.mockRejectedValue({
      errors: [{ type: 'UNAUTHENTICATED', message: 'x' }],
    });
    const hook = await render();
    await type(hook, 'Anna');

    expect(mockResetToLogin).toHaveBeenCalledWith({ notice: 'sessionExpired' });
  });
});
