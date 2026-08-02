import { Camera, LocationPuck, UserLocation } from '@rnmapbox/maps';
import * as S from './styles';
import { Header } from '../../templates/app/home/components/Header';

type MapProps = {
  hideUserLocation?: boolean;
};

export const Map = ({ hideUserLocation }: MapProps) => {
  return (
    <S.MapContainer
      scaleBarEnabled={false}
      logoEnabled={false}
      attributionEnabled={false}
    >
      <Header />
      <Camera followUserLocation followZoomLevel={14} />
      {!hideUserLocation && (
        <>
          <LocationPuck
            puckBearing="heading"
            puckBearingEnabled
            pulsing={{ isEnabled: true }}
          />
          <UserLocation animated requestsAlwaysUse showsUserHeadingIndicator />
        </>
      )}
    </S.MapContainer>
  );
};
