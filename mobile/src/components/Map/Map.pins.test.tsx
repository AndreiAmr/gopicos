import { screen } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
import { config } from '../../config/tamagui/tamagui.config';
import { renderWithTheme } from '../../test-utils/renderWithTheme';
import { PIN_LABELS, SpotSummary, pinText } from '../../domain/spot/spot';
import { pinImageName } from './MapImages';
import { Map } from './index';

// O SDK nativo não roda no Jest: cada componente vira uma <View> com as props
// recebidas, identificada pelo `id` (camadas/fontes) ou `name` (imagens).
jest.mock('@rnmapbox/maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const make = (name: string) => {
    const Component = React.forwardRef((props: any, _ref: unknown) =>
      React.createElement(
        View,
        {
          ...props,
          testID: props.id ?? (props.name ? `image-${props.name}` : name),
        },
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
  name: 'Park Augusta',
  modality: 'park',
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
  ratingAverage: 3.5,
  reviewsCount: 2,
};

describe('Map - pins com a nota (GP-132)', () => {
  it('as imagens dos pins já existem antes de os picos chegarem e não mudam depois', async () => {
    const { rerender } = await renderWithTheme(<Map spots={[]} />);
    const before = screen.getByTestId('Images');
    const imagesBefore = screen.getAllByTestId(/^image-pin-/).length;
    expect(imagesBefore).toBe(PIN_LABELS.length * 2);

    await rerender(
      <TamaguiProvider config={config} defaultTheme="light">
        <Map spots={[spot]} />
      </TamaguiProvider>,
    );

    // Mesmo componente `Images` (não remontado) e mesmo conjunto de imagens.
    expect(screen.getByTestId('Images')).toBe(before);
    expect(screen.getAllByTestId(/^image-pin-/)).toHaveLength(imagesBefore);
  });

  it('o pin do pico aponta para uma imagem registrada com a nota dele', async () => {
    await renderWithTheme(<Map spots={[spot]} />);

    const expression = screen.getByTestId('spots-pin').props.style.iconImage;
    const label = pinText(spot);
    expect(label).toBe('★ 3,5');
    const index = expression.indexOf(label);
    expect(index).toBeGreaterThan(0);
    const imageName = expression[index + 1];
    expect(imageName).toBe(pinImageName(PIN_LABELS.indexOf(label)));
    expect(screen.getByTestId(`image-${imageName}`)).toBeTruthy();
  });
});
