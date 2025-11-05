import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { MapMouseEvent } from 'mapbox-gl';
import Mapbox, {
  MapRef,
  MapProps as MapPropsMapbox,
} from 'react-map-gl/mapbox';
import { useTheme } from 'next-themes';

type MapProps = PropsWithChildren &
  MapPropsMapbox & {
    lat?: number;
    lon?: number;

    onClick?: (event: MapMouseEvent) => void;
    // coordinates: number[][][];
  };

export const Map = ({ lat, lon, onClick, children, ...mapProps }: MapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (lat && lon) {
      mapRef.current?.flyTo({
        center: [Number(lon), Number(lat)],
        zoom: 17,
        essential: true,
      });
    }
  }, [lat, lon]);

  useEffect(() => {
    mapRef.current?.loadImage('/skater-pin.png', (error, image) => {
      console.log({ error, image });
      if (!mapRef.current?.hasImage('custom-skater') && image) {
        mapRef.current?.addImage('custom-skater', image, {
          sdf: false,
        });
      }
    });
  }, [showChildren, mapRef]);

  return (
    <Mapbox
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
      }}
      mapboxAccessToken="pk.eyJ1Ijoic29uZWNhLWRldiIsImEiOiJjbTlwdXBvZHcwcHp3MnZvZ2dlemw1eGc2In0.eC8keYLoT3I6bGCEZrTZtg"
      initialViewState={{
        longitude: lat ? lat : -46.6801928,
        latitude: lon ? lon : -23.7642516,
        zoom: 13,
        pitch: 0,
        bearing: 0,
      }}
      onClick={onClick}
      mapStyle={
        theme === 'dark'
          ? 'mapbox://styles/soneca-dev/cm9pwu19h00l701s63khw175t'
          : 'mapbox://styles/soneca-dev/cm9pwp2hq00jg01rw9k3u8ape'
      }
      onLoad={() => setShowChildren(true)}
      {...mapProps}
    >
      {showChildren && children}
    </Mapbox>
  );
};
