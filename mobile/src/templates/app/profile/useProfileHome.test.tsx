import { act, renderHook } from '@testing-library/react-native';
import { useProfileHome } from './useProfileHome';

const mockNavigate = jest.fn();
const mockLogout = jest.fn().mockResolvedValue(undefined);
let mockProfileState: Record<string, unknown>;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('../../../hooks/query/profile/useProfile', () => ({
  useProfile: () => mockProfileState,
}));
jest.mock('../../../services/session/logout', () => ({
  logout: () => mockLogout(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockProfileState = {
    profile: { id: '1' },
    loading: false,
    error: null,
    refreshing: false,
    refresh: jest.fn(),
  };
});

describe('useProfileHome', () => {
  it('abre a edição', async () => {
    const { result } = await renderHook(() => useProfileHome());
    await act(async () => result.current.goToEdit());
    expect(mockNavigate).toHaveBeenCalledWith('ProfileEdit');
  });

  it('expõe o estado de erro de carregamento', async () => {
    mockProfileState = { ...mockProfileState, profile: null, error: new Error('x') };
    const { result } = await renderHook(() => useProfileHome());
    expect(result.current.hasError).toBe(true);
  });

  it('Sair abre o bottom sheet e só encerra a sessão ao confirmar', async () => {
    const { result } = await renderHook(() => useProfileHome());
    const sheet = { present: jest.fn(), dismiss: jest.fn() };
    (result.current.logoutSheetRef as { current: unknown }).current = sheet;

    await act(async () => result.current.confirmLogout());
    expect(sheet.present).toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();

    await act(async () => result.current.cancelLogout());
    expect(sheet.dismiss).toHaveBeenCalledTimes(1);
    expect(mockLogout).not.toHaveBeenCalled();

    await act(async () => result.current.doLogout());
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(sheet.dismiss).toHaveBeenCalledTimes(2);
    expect(result.current.leaving).toBe(false);
  });

  it('falha ao encerrar não trava a tela', async () => {
    mockLogout.mockRejectedValueOnce(new Error('keychain'));
    const { result } = await renderHook(() => useProfileHome());
    await act(async () => result.current.doLogout());
    expect(result.current.leaving).toBe(false);
  });
});
