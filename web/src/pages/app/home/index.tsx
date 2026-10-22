import { Map } from '@/components/map';
import { useHome } from './useHome';
import { MapPolygon } from '@/components/map/polygon';

export const HomePage = () => {
  const { spots, mapRef } = useHome();

  return (
    <div className="h-full w-full overflow-hidden">
      <Map mapRef={mapRef}>
        {spots?.map((spot) => (
          <MapPolygon key={spot.id} spot={spot} />
        ))}
      </Map>
    </div>
  );
};
