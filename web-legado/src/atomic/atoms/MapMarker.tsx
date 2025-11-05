import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useState } from 'react';
import { Marker, Popup } from 'react-map-gl/mapbox';

type MapMarkerProps = PropsWithChildren & {
  lat: number;
  lng: number;
  spot?: SpotProps;
};

const MapMarker = ({ lat, lng, spot, children }: MapMarkerProps) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <Marker
        latitude={lat}
        longitude={lng}
        anchor="bottom"
        offset={[0, 10]}
        pitchAlignment="map"
        rotationAlignment="map"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      >
        {children}
        <Image
          src={'/skater-pin.png'}
          alt="eu tenteii"
          height={40}
          width={40}
          className="max-h-10 max-w-10"
        />
      </Marker>
      {showPopup && spot && (
        <Popup
          anchor="bottom"
          latitude={lat}
          longitude={lng}
          onClose={() => setShowPopup(false)}
          offset={20}
          className="w-70 h-100 rounded-b-xl overflow-hidden "
          closeButton={false}
          maxWidth={undefined}
        >
          <div className="h-30 w-60">
            <Image
              alt="testing"
              src={spot.images[0]}
              // width={240} // 60 * 4 px (Tailwind h-30 w-60 = 7.5rem * 4px base)
              // height={120}
              className="max-h-30 rounded-sm object-cover"
              fill
              unoptimized
            />
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-md">{spot.name}</h2>
            <Button onClick={() => router.push(`/spot/spotDetails/${spot.id}`)}>
              Ver pico <ArrowRight />
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default MapMarker;
