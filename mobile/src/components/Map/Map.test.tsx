import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils/renderWithTheme';
import { SpotSummary } from '../../domain/spot/spot';
import { Map } from './index';

// O SDK nativo não roda no Jest: cada componente vira uma <View> com as props
// recebidas, identificada pelo `id` da camada/fonte.
jest.mock('@rnmapbox/maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const make = (name: string) => {
    const Component = React.forwardRef((props: any, _ref: unknown) =>
      React.createElement(
        View,
        { ...props, testID: props.id ?? props.testID ?? name },
        props.children,
      ),
    );
    Component.displayName = name;
    return Component;
  };
  const MapView = make('MapView');
  return {
    __esModule: true,
    default: { MapView },
    MapView,
    Camera: make('Camera'),
    FillLayer: make('FillLayer'),
    LineLayer: make('LineLayer'),
    LocationPuck: make('LocationPuck'),
    ShapeSource: make('ShapeSource'),
    StyleImport: make('StyleImport'),
    SymbolLayer: make('SymbolLayer'),
    UserLocation: make('UserLocation'),
    Images: make('Images'),
    Image: make('Image'),
  };
});

const spot: SpotSummary = {
  id: 'spot-1',
  name: 'Pista da Praça',
  modality: 'street',
  coordinates: {
    type: 'Polygon',
    coordinates: [
      [
        [-46.63, -23.55],
        [-46.62, -23.55],
        [-46.62, -23.56],
        [-46.63, -23.55],
      ],
    ],
  },
  ratingAverage: 4.6,
  reviewsCount: 3,
};

describe('Map - polígonos (GP-134)', () => {
  it('desenha os polígonos em qualquer zoom (sem limite de zoom nas camadas)', async () => {
    await renderWithTheme(<Map spots={[spot]} />);

    for (const id of ['spots-fill', 'spots-line', 'spots-line-selected']) {
      const layer = screen.getByTestId(id);
      expect(layer.props.minZoomLevel).toBeUndefined();
      expect(layer.props.maxZoomLevel).toBeUndefined();
    }
  });

  it('o preenchimento usa cor e opacidade (não fica vazado)', async () => {
    await renderWithTheme(<Map spots={[spot]} />);

    const fill = screen.getByTestId('spots-fill');
    expect(fill.props.style.fillColor).toBeTruthy();
    expect(fill.props.style.fillOpacity).toBeTruthy();
  });
});
