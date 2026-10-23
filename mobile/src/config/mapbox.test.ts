/* eslint-env jest */
import Mapbox from '@rnmapbox/maps';
import { configureMapbox } from './mapbox';

jest.mock('@rnmapbox/maps', () => ({
  __esModule: true,
  default: { setAccessToken: jest.fn() },
}));

describe('configureMapbox', () => {
  beforeEach(() => jest.clearAllMocks());

  it('registra o token quando presente', () => {
    expect(configureMapbox(' pk.abc ')).toBe(true);
    expect(Mapbox.setAccessToken).toHaveBeenCalledWith('pk.abc');
  });

  it.each([undefined, '', '   '])('não quebra nem registra com %p', value => {
    expect(configureMapbox(value)).toBe(false);
    expect(Mapbox.setAccessToken).not.toHaveBeenCalled();
  });
});
