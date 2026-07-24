import Mapbox from '@rnmapbox/maps';
import styled from 'styled-components/native';

export const MapContainer = styled(Mapbox.MapView)`
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
