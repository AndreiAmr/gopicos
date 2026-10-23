import { AppState, AppStateStatus } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { LOCATION_TIMEOUT_MS } from '../../../domain/map/location';
import { useLocationControl } from './useLocationControl';

const mockCheck = jest.fn();
const mockRequest = jest.fn();
jest.mock('../../../services/location/permission', () => ({
  checkLocationPermission: () => mockCheck(),
  requestLocationPermission: () => mockRequest(),
}));

let appStateListener: ((state: AppStateStatus) => void) | null = null;

const setup = async () => {
  const options = {
    onCenter: jest.fn(),
    onError: jest.fn(),
    onOpenPermissionSheet: jest.fn(),
    onPosition: jest.fn(),
  };
  const hook = await renderHook(() => useLocationControl(options));
  // Deixa a checagem inicial da permissão terminar.
  await act(async () => {});
  return { ...hook, options };
};

describe('useLocationControl (spec home.md 6.3)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    appStateListener = null;
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => {
      appStateListener = listener as (state: AppStateStatus) => void;
      return { remove: jest.fn() } as never;
    });
  });
  afterEach(() => jest.useRealTimers());

  it('ainda não pedida: o toque pede a permissão, busca e centraliza na primeira posição', async () => {
    mockCheck.mockResolvedValue('undetermined');
    mockRequest.mockResolvedValue('granted');
    const { result, options } = await setup();
    expect(result.current.status).toBe('idle');
    expect(result.current.showUserLocation).toBe(false);

    await act(async () => result.current.press());
    expect(result.current.status).toBe('searching');
    expect(result.current.showUserLocation).toBe(true);

    await act(async () => result.current.onFix([-46.65, -23.56]));
    expect(options.onCenter).toHaveBeenCalledWith([-46.65, -23.56]);
    expect(options.onPosition).toHaveBeenCalledWith([-46.65, -23.56]);
    expect(result.current.status).toBe('centered');

    await act(async () => result.current.onGesture());
    expect(result.current.status).toBe('moved');
    await act(async () => result.current.press());
    expect(options.onCenter).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('centered');
  });

  it('10 s buscando sem posição: toast de erro e volta ao estado anterior', async () => {
    mockCheck.mockResolvedValue('undetermined');
    mockRequest.mockResolvedValue('granted');
    const { result, options } = await setup();

    await act(async () => result.current.press());
    expect(result.current.status).toBe('searching');
    await act(async () => {
      jest.advanceTimersByTime(LOCATION_TIMEOUT_MS);
    });
    expect(options.onError).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('idle');
  });

  it('busca automática na abertura não mostra toast se esgotar o tempo', async () => {
    mockCheck.mockResolvedValue('granted');
    const { result, options } = await setup();
    expect(result.current.status).toBe('searching');
    await act(async () => {
      jest.advanceTimersByTime(LOCATION_TIMEOUT_MS);
    });
    expect(options.onError).not.toHaveBeenCalled();
  });

  it('negada abre o sheet; ao voltar dos ajustes com permissão, passa a buscar', async () => {
    mockCheck.mockResolvedValue('undetermined');
    mockRequest.mockResolvedValue('denied');
    const { result, options } = await setup();

    await act(async () => result.current.press());
    expect(result.current.status).toBe('denied');
    expect(options.onOpenPermissionSheet).toHaveBeenCalledTimes(1);

    await act(async () => result.current.press());
    expect(options.onOpenPermissionSheet).toHaveBeenCalledTimes(2);

    mockCheck.mockResolvedValue('granted');
    await act(async () => appStateListener?.('active'));
    expect(result.current.status).toBe('searching');
  });
});
