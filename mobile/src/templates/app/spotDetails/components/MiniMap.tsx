import Mapbox, { Camera, FillLayer, LineLayer, ShapeSource } from '@rnmapbox/maps';
import { View } from 'tamagui';
import { mapColors, radius } from '../../../../config/tamagui/tokens';
import {
  SpotSummary,
  buildPolygonCollection,
  polygonCenter,
} from '../../../../domain/spot/spot';

type MiniMapProps = { spot: SpotSummary };

/** Mini-mapa estático (160 de altura) com o polígono do pico. */
export const MiniMap = ({ spot }: MiniMapProps) => {
  const center = polygonCenter(spot.coordinates);

  if (!center) {
    return null;
  }

  return (
    <View
      height={160}
      borderRadius={radius.lg}
      overflow="hidden"
      borderWidth={1}
      borderColor="$divider"
      accessible
      accessibilityLabel={`Mapa com a área de ${spot.name}`}
      testID="spot-mini-map"
    >
      <Mapbox.MapView
        style={{ flex: 1 }}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Camera centerCoordinate={center} zoomLevel={16} animationDuration={0} />
        <ShapeSource
          id="spot-detail-polygon"
          shape={buildPolygonCollection([spot], spot.id)}
        >
          <FillLayer
            id="spot-detail-fill"
            style={{ fillColor: mapColors.spotFill, fillOpacity: 0.38 }}
          />
          <LineLayer
            id="spot-detail-line"
            style={{ lineColor: mapColors.spotStroke, lineWidth: 3 }}
          />
        </ShapeSource>
      </Mapbox.MapView>
    </View>
  );
};
