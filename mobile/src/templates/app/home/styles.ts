import Mapbox from '@rnmapbox/maps';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  position: relative;
`;

export const MapContainer = styled(Mapbox.MapView)`
  flex: 1;
`;
