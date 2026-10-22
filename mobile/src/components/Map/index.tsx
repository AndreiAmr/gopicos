import {
  Camera,
  locationManager,
  type Location,
  LocationPuck,
  UserLocation,
} from '@rnmapbox/maps';
import * as S from './styles';
import { Header } from '../../templates/app/home/components/Header';
import {
  ElementRef,
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
} from 'react';

type MapProps = PropsWithChildren & {
  hideUserLocation?: boolean;
  styleURL?: string;
};

export type MapHandle = {
  centerOnUser: () => Promise<void>;
};

export const Map = forwardRef<MapHandle, MapProps>(
  ({ hideUserLocation, styleURL, children }, ref) => {
    const cameraRef = useRef<ElementRef<typeof Camera>>(null);
    const lastLocation = useRef<Location | null>(null);

    useImperativeHandle(ref, () => ({
      centerOnUser: async () => {
        const location =
          lastLocation.current ?? (await locationManager.getLastKnownLocation());
        const coords = location?.coords;

        if (!coords) {
          console.warn('centerOnUser: localização do usuário indisponível');
          return;
        }

        cameraRef.current?.moveTo([coords.longitude, coords.latitude], 500);
      },
    }));

    return (
      <S.MapContainer
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        styleURL={styleURL}
      >
        <Header />
        <Camera ref={cameraRef} followUserLocation followZoomLevel={14} />
        {!hideUserLocation && (
          <>
            <LocationPuck
              puckBearing="heading"
              puckBearingEnabled
              pulsing={{ isEnabled: true }}
            />
            <UserLocation
              animated
              requestsAlwaysUse
              showsUserHeadingIndicator
              onUpdate={location => {
                lastLocation.current = location;
              }}
            />
          </>
        )}
        {children}
      </S.MapContainer>
    );
  },
);

Map.displayName = 'Map';
