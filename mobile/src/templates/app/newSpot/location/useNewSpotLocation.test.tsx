import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useNewSpotLocation } from './useNewSpotLocation';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();
let beforeRemove: ((event: any) => void) | undefined;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    dispatch: mockDispatch,
    addListener: (_name: string, listener: (event: any) => void) => {
      beforeRemove = listener;
      return () => undefined;
    },
  }),
}));

const mockShow = jest.fn();
jest.mock('../../../../atomic/ds/molecules/Toast', () => ({
  useToast: () => ({ show: mockShow, hide: jest.fn() }),
}));

describe('useNewSpotLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    beforeRemove = undefined;
  });

  it('adiciona, desfaz, limpa e só continua com 3 pontos', async () => {
    const { result } = await renderHook(() => useNewSpotLocation());

    await act(async () => result.current.add([-46.65, -23.55]));
    await act(async () => result.current.add([-46.64, -23.55]));
    expect(result.current.canContinue).toBe(false);
    expect(result.current.countText).toBe('Marque pelo menos 3 pontos');

    await act(async () => result.current.goNext());
    expect(mockNavigate).not.toHaveBeenCalled();

    await act(async () => result.current.add([-46.64, -23.56]));
    expect(result.current.canContinue).toBe(true);
    expect(result.current.countText).toBe('3 pontos');

    await act(async () => result.current.goNext());
    expect(mockNavigate).toHaveBeenCalledWith('NewSpotDetails', {
      coordinates: {
        type: 'Polygon',
        coordinates: [
          [
            [-46.65, -23.55],
            [-46.64, -23.55],
            [-46.64, -23.56],
            [-46.65, -23.55],
          ],
        ],
      },
    });

    await act(async () => result.current.undo());
    expect(result.current.points).toHaveLength(2);
    await act(async () => result.current.clear());
    expect(result.current.points).toHaveLength(0);
  });

  it('adiciona ponto no centro do mapa e move vértice', async () => {
    const { result } = await renderHook(() => useNewSpotLocation());

    await act(async () => result.current.addAtCenter());
    expect(result.current.points).toHaveLength(0);

    await act(async () => result.current.setCenter([-46.6, -23.5]));
    await act(async () => result.current.addAtCenter());
    expect(result.current.points).toEqual([[-46.6, -23.5]]);

    await act(async () => result.current.move(0, [-46.61, -23.51]));
    expect(result.current.points).toEqual([[-46.61, -23.51]]);
  });

  it('usar minha posição: sem permissão mostra toast; com posição adiciona e centraliza', async () => {
    const { result } = await renderHook(() => useNewSpotLocation());

    await act(async () => result.current.useMyLocation());
    expect(mockShow).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info' }),
    );

    await act(async () => result.current.setUserPosition([-46.7, -23.6]));
    await act(async () => result.current.useMyLocation());
    expect(result.current.points).toEqual([[-46.7, -23.6]]);
    expect(result.current.focus).toEqual([-46.7, -23.6]);
  });

  it('sair com pontos pede confirmação', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const { result } = await renderHook(() => useNewSpotLocation());

    const empty = { preventDefault: jest.fn(), data: { action: {} } };
    beforeRemove?.(empty);
    expect(empty.preventDefault).not.toHaveBeenCalled();

    await act(async () => result.current.add([-46.65, -23.55]));
    const event = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    beforeRemove?.(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      'Descartar o local marcado?',
      undefined,
      expect.any(Array),
    );
    alert.mockRestore();
  });
});
