import {
  Camera,
  FillLayer,
  LineLayer,
  LocationPuck,
  MarkerView,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import * as S from './styles';
import { mapColors } from '../../config/tamagui/tokens';
import { SpotPin } from '../../atomic/ds';
import type { CameraTarget } from '../../domain/place/place';
import {
  SpotSummary,
  buildPolygonCollection,
  drawableSpots,
  polygonCenter,
} from '../../domain/spot/spot';

/** A partir deste zoom os polígonos aparecem; mais longe, só os pins. */
const POLYGON_MIN_ZOOM = 15;

type MapProps = {
  hideUserLocation?: boolean;
  spots?: SpotSummary[];
  selectedId?: string | null;
  onSelectSpot?: (id: string) => void;
  onMapPress?: () => void;
  /** Posição do usuário em [lng, lat], quando a permissão foi concedida. */
  onUserLocation?: (position: [number, number]) => void;
  /** Lugar buscado: a câmera voa até ele (sem animação com "reduzir movimento"). */
  placeTarget?: CameraTarget | null;
  placeAnimationMs?: number;
};

export const Map = ({
  hideUserLocation,
  spots = [],
  selectedId = null,
  onSelectSpot,
  onMapPress,
  onUserLocation,
  placeTarget = null,
  placeAnimationMs = 800,
}: MapProps) => {
  const selected = selectedId
    ? spots.find(spot => spot.id === selectedId)
    : undefined;
  const selectedCenter = selected ? polygonCenter(selected.coordinates) : null;

  return (
    <S.MapContainer
      scaleBarEnabled={false}
      logoEnabled={false}
      attributionEnabled={false}
      onPress={() => onMapPress?.()}
    >
      {placeTarget && !selectedCenter ? (
        placeTarget.type === 'bounds' ? (
          <Camera
            bounds={{
              ne: placeTarget.ne,
              sw: placeTarget.sw,
              paddingTop: 96,
              paddingBottom: 96,
              paddingLeft: 32,
              paddingRight: 32,
            }}
            animationDuration={placeAnimationMs}
            animationMode="flyTo"
          />
        ) : (
          <Camera
            centerCoordinate={placeTarget.center}
            zoomLevel={placeTarget.zoom}
            animationDuration={placeAnimationMs}
            animationMode="flyTo"
          />
        )
      ) : selectedCenter ? (
        <Camera
          centerCoordinate={selectedCenter}
          animationDuration={400}
          animationMode="easeTo"
        />
      ) : (
        <Camera followUserLocation followZoomLevel={14} />
      )}

      <ShapeSource
        id="spots-polygons"
        shape={buildPolygonCollection(spots, selectedId)}
        onPress={event => {
          const id = event.features[0]?.properties?.id;
          if (id) {
            onSelectSpot?.(String(id));
          }
        }}
      >
        <FillLayer
          id="spots-fill"
          minZoomLevel={POLYGON_MIN_ZOOM}
          style={{
            fillColor: mapColors.spotFill,
            fillOpacity: ['case', ['get', 'selected'], 0.38, 0.22],
          }}
        />
        <LineLayer
          id="spots-line"
          minZoomLevel={POLYGON_MIN_ZOOM}
          style={{
            lineColor: mapColors.spotStroke,
            lineWidth: ['case', ['get', 'selected'], 3, 2],
          }}
        />
      </ShapeSource>

      {drawableSpots(spots).map(spot => (
        <MarkerView
          key={spot.id}
          id={`spot-${spot.id}`}
          coordinate={polygonCenter(spot.coordinates) as [number, number]}
        >
          <SpotPin
            spot={spot}
            selected={spot.id === selectedId}
            onPress={() => onSelectSpot?.(spot.id)}
          />
        </MarkerView>
      ))}

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
            onUpdate={location =>
              onUserLocation?.([
                location.coords.longitude,
                location.coords.latitude,
              ])
            }
          />
        </>
      )}
    </S.MapContainer>
  );
};
