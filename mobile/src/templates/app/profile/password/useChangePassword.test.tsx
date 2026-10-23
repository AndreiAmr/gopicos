import { act, renderHook } from '@testing-library/react-native';
import { useChangePassword } from './useChangePassword';
import {
  changePasswordSchema,
  mapChangePasswordError,
} from './logic';

const mockGoBack = jest.fn();
const mockToast = jest.fn();
const mockMutate = jest.fn();
const mockResetToLogin = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));
jest.mock('../../../../atomic/ds', () => ({
  useToast: () => ({ show: mockToast }),
}));
jest.mock(
  '../../../../hooks/mutation/changePassword/useChangePasswordMutation',
  () => ({
    useChangePasswordMutation: () => ({ mutate: mockMutate, loading: false }),
  }),
);
jest.mock('../../../../routes/navigationRef', () => ({
  resetToLogin: (p: unknown) => mockResetToLogin(p),
}));

const submit = async (
  current = 'senhaAtual1',
  next = 'novaSenha123',
  confirm = 'novaSenha123',
) => {
  const hook = await renderHook(() => useChangePassword());
  await act(async () => {
    hook.result.current.control._formValues.currentPassword = current;
    hook.result.current.control._formValues.newPassword = next;
    hook.result.current.control._formValues.confirmPassword = confirm;
    await hook.result.current.handleSubmit();
  });
  return hook;
};

beforeEach(() => jest.clearAllMocks());

describe('changePasswordSchema', () => {
  const base = {
    currentPassword: 'senhaAtual1',
    newPassword: 'novaSenha123',
    confirmPassword: 'novaSenha123',
  };

  it('aceita dados válidos', async () => {
    await expect(changePasswordSchema.validate(base)).resolves.toEqual(base);
  });

  it.each([
    ['currentPassword', { currentPassword: '' }, 'Informe sua senha atual.'],
    ['newPassword', { newPassword: '' }, 'Crie uma nova senha.'],
    ['newPassword', { newPassword: 'curta' }, 'ao menos 8 caracteres'],
    ['newPassword', { newPassword: 'senhaAtual1' }, 'diferente da atual'],
    ['confirmPassword', { confirmPassword: 'outra123456' }, 'As senhas não coincidem.'],
    ['confirmPassword', { confirmPassword: '' }, 'Confirme a nova senha.'],
  ])('rejeita %s com %j', async (field, patch, message) => {
    await expect(
      changePasswordSchema.validateAt(field, { ...base, ...patch }),
    ).rejects.toThrow(message);
  });
});

describe('mapChangePasswordError', () => {
  it('INVALID_CREDENTIALS marca a senha atual', () => {
    expect(
      mapChangePasswordError({ errors: [{ type: 'INVALID_CREDENTIALS', message: 'x' }] }),
    ).toEqual({
      kind: 'field',
      field: 'currentPassword',
      message: 'Senha atual incorreta.',
    });
  });

  it('VALIDATION_ERROR de newPassword vai ao campo', () => {
    expect(
      mapChangePasswordError({
        errors: [
          { message: 'curta', extensions: { type: 'VALIDATION_ERROR', field: 'newPassword' } },
        ],
      }),
    ).toEqual({ kind: 'field', field: 'newPassword', message: 'curta' });
  });

  it('rede vira banner', () => {
    expect(mapChangePasswordError({ networkError: {} })).toEqual(
      expect.objectContaining({ kind: 'banner' }),
    );
  });
});

describe('useChangePassword', () => {
  it('sucesso envia as senhas, mostra o toast e volta', async () => {
    mockMutate.mockResolvedValue({ data: {} });
    await submit();

    expect(mockMutate).toHaveBeenCalledWith({
      variables: {
        props: { currentPassword: 'senhaAtual1', newPassword: 'novaSenha123' },
      },
    });
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', message: 'Senha alterada.' }),
    );
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('confirmação diferente não chama o servidor', async () => {
    const hook = await submit('senhaAtual1', 'novaSenha123', 'outraSenha1');

    expect(mockMutate).not.toHaveBeenCalled();
    expect(hook.result.current.errors.confirmPassword?.message).toBe(
      'As senhas não coincidem.',
    );
  });

  it('senha atual incorreta mostra erro no campo e não volta', async () => {
    mockMutate.mockRejectedValue({
      errors: [{ type: 'INVALID_CREDENTIALS', message: 'x' }],
    });
    const hook = await submit();

    expect(hook.result.current.errors.currentPassword?.message).toBe(
      'Senha atual incorreta.',
    );
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('erro de rede mostra banner e preserva a tela', async () => {
    mockMutate.mockRejectedValue({ networkError: {} });
    const hook = await submit();

    expect(hook.result.current.banner).toMatch(/conexão/);
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED leva ao Login', async () => {
    mockMutate.mockRejectedValue({
      errors: [{ type: 'UNAUTHENTICATED', message: 'x' }],
    });
    await submit();

    expect(mockResetToLogin).toHaveBeenCalledWith({ notice: 'sessionExpired' });
  });
});
