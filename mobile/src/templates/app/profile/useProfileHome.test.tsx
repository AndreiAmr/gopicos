import { Alert } from 'react-native';
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

  it('Sair pede confirmação e só encerra a sessão ao confirmar', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const { result } = await renderHook(() => useProfileHome());

    await act(async () => result.current.confirmLogout());
    expect(alert).toHaveBeenCalledWith(
      'Sair do GoPicos?',
      expect.any(String),
      expect.any(Array),
    );
    expect(mockLogout).not.toHaveBeenCalled();

    const buttons = alert.mock.calls[0][2] as { text: string; onPress?: () => void }[];
    buttons.find(b => b.text === 'Sair')?.onPress?.();
    expect(mockLogout).toHaveBeenCalled();
  });
});
