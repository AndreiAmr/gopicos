import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { RefObject, useEffect, useState } from 'react';
import { MapRef } from 'react-map-gl/mapbox';

export type UseMapProps = {
  mapRef: RefObject<MapRef | null>;
  handleDrawCreate?(e: MapboxDraw.DrawEvent): void;
  handleDrawUpdate?(e: MapboxDraw.DrawEvent): void;
  handleDrawDelete?(e: MapboxDraw.DrawEvent): void;
};

export const useMap = ({
  mapRef,
  handleDrawCreate,
  handleDrawUpdate,
  handleDrawDelete,
}: UseMapProps) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      mapRef?.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapRef]);

  useEffect(() => {
    mapRef.current?.loadImage('/skater-pin.png', (error, image) => {
      if (!mapRef?.current?.hasImage('custom-skater') && image) {
        mapRef?.current?.addImage('custom-skater', image, {
          sdf: false,
        });
      }
    });
  }, [showChildren, mapRef]);

  useEffect(() => {
    if (!handleDrawCreate && !handleDrawUpdate && !handleDrawDelete) {
      return;
    }

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
        line_string: true,
        point: true,
      },

      defaultMode: 'draw_polygon',
    });
    mapRef?.current?.addControl(draw);

    if (handleDrawCreate) {
      mapRef.current?.on('draw.create', handleDrawCreate);
    }

    if (handleDrawUpdate) {
      mapRef.current?.on('draw.update', handleDrawUpdate);
    }

    if (handleDrawDelete) {
      mapRef.current?.on('draw.delete', handleDrawDelete);
    }
  }, [
    mapRef,
    mapRef.current,
    handleDrawCreate,
    handleDrawUpdate,
    handleDrawDelete,
  ]);
  return {
    showChildren,
    setShowChildren,
    mapRef,
  };
};
