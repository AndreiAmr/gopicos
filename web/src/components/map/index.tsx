import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { PropsWithChildren, RefObject } from 'react';
import { MapMouseEvent } from 'mapbox-gl';
import Mapbox, {
  MapProps as MapPropsMapbox,
  MapRef,
} from 'react-map-gl/mapbox';
import { useMap, UseMapProps } from './useMap';

type MapProps = PropsWithChildren &
  MapPropsMapbox &
  UseMapProps & {
    onClick?: (event: MapMouseEvent) => void;
    mapRef: RefObject<MapRef | null>;
  };

export const Map = ({
  onClick,
  children,
  mapRef,
  handleDrawCreate,
  handleDrawUpdate,
  handleDrawDelete,
  ...mapProps
}: MapProps) => {
  const { setShowChildren, showChildren } = useMap({
    mapRef,
    handleDrawCreate,
    handleDrawUpdate,
    handleDrawDelete,
  });

  console.log('env =>', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);

  return (
    <Mapbox
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
      }}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      // initialViewState={{
      //   longitude: -46.6801928,
      //   latitude: -23.7642516,
      //   zoom: 13,
      //   pitch: 0,
      //   bearing: 0,
      // }}
      onClick={onClick}
      mapStyle={
        // theme === 'dark'
        // 'mapbox://styles/soneca-dev/cm9pwu19h00l701s63khw175t'
        'mapbox://styles/soneca-dev/cm9pwp2hq00jg01rw9k3u8ape'
      }
      onLoad={() => setShowChildren(true)}
      {...mapProps}
    >
      {showChildren && children}
    </Mapbox>
  );
};
