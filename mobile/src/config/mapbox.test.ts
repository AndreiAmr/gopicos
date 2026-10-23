/* eslint-env jest */
const setAccessToken = jest.fn();

jest.mock('@rnmapbox/maps', () => ({
  __esModule: true,
  default: { setAccessToken: (...args: unknown[]) => setAccessToken(...args) },
}));

const load = (token: string | undefined) => {
  jest.resetModules();
  setAccessToken.mockClear();
  jest.doMock('@env', () => ({ MAPBOX_ACCESS_TOKEN: token }));
  return require('./mapbox') as typeof import('./mapbox');
};

describe('mapbox config', () => {
  it('registra o token quando presente', () => {
    const m = load('pk.abc');
    expect(m.isMapboxConfigured).toBe(true);
    expect(m.initMapbox()).toBe(true);
    expect(setAccessToken).toHaveBeenCalledWith('pk.abc');
  });

  it('não quebra nem registra sem token', () => {
    const m = load('');
    expect(m.isMapboxConfigured).toBe(false);
    expect(m.initMapbox()).toBe(false);
    expect(setAccessToken).not.toHaveBeenCalled();
  });
});
