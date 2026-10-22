import Mapbox from '@rnmapbox/maps';
import type { ImageSourcePropType } from 'react-native';

export type MapLayer = {
  id: string;
  label: string;
  styleURL: string;
  image: ImageSourcePropType;
};

export const mapLayers: MapLayer[] = [
  {
    id: 'street',
    label: 'Ruas',
    styleURL: Mapbox.StyleURL.Street,
    image: require('../../../../../assets/images/layers/streets.png'),
  },
  {
    id: 'satellite',
    label: 'Satélite',
    styleURL: Mapbox.StyleURL.Satellite,
    image: require('../../../../../assets/images/layers/satellite.jpeg'),
  },
  {
    id: 'outdoors',
    label: 'Relevo',
    styleURL: Mapbox.StyleURL.Outdoors,
    image: require('../../../../../assets/images/layers/outdoors.png'),
  },
];
