import { useRef } from 'react';
import Mapbox, {
  Camera,
  CircleLayer,
  FillLayer,
  LineLayer,
  LocationPuck,
  MarkerView,
  ShapeSource,
  SymbolLayer,
  UserLocation,
} from '@rnmapbox/maps';
import * as S from './styles';
import { mapColors } from '../../config/tamagui/tokens';
import { SpotPin } from '../../atomic/ds';
import type { CameraTarget } from '../../domain/place/place';
import {
  SpotSummary,
  buildPointCollection,
  buildPolygonCollection,
  pickPressTarget,
  polygonCenter,
} from '../../domain/spot/spot';

/** A partir deste zoom os polígonos aparecem; mais longe, só os pins. */
const POLYGON_MIN_ZOOM = 15;
/** Cluster nativo (spec 11): raio em px e zoom a partir do qual todo pico aparece solto. */
const CLUSTER_RADIUS = 50;
const CLUSTER_MAX_ZOOM = 14;
const PIN_FONT = ['DIN Pro Medium', 'Arial Unicode MS Regular'];
const CLUSTER_FONT = ['DIN Pro Bold', 'Arial Unicode MS Bold'];

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
  /** Duração da aproximação ao tocar num cluster (0 com "reduzir movimento"). */
  clusterAnimationMs?: number;
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
  clusterAnimationMs = 400,
}: MapProps) => {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const pointsRef = useRef<Mapbox.ShapeSource>(null);

  // Toque num cluster aproxima o mapa até expandi-lo; não abre o resumo.
  const zoomIntoCluster = async (feature: unknown, center: [number, number]) => {
    try {
      const zoom = await pointsRef.current?.getClusterExpansionZoom(
        feature as never,
      );
      if (typeof zoom === 'number') {
        cameraRef.current?.setCamera({
          centerCoordinate: center,
          zoomLevel: zoom,
          animationDuration: clusterAnimationMs,
          animationMode: 'easeTo',
        });
      }
    } catch {
      // sem expansão disponível: o toque simplesmente não faz nada
    }
  };

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
            ref={cameraRef}
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
            ref={cameraRef}
            centerCoordinate={placeTarget.center}
            zoomLevel={placeTarget.zoom}
            animationDuration={placeAnimationMs}
            animationMode="flyTo"
          />
        )
      ) : selectedCenter ? (
        <Camera
            ref={cameraRef}
          centerCoordinate={selectedCenter}
          animationDuration={400}
          animationMode="easeTo"
        />
      ) : (
        <Camera ref={cameraRef} followUserLocation followZoomLevel={14} />
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

      <ShapeSource
        id="spots-points"
        ref={pointsRef}
        shape={buildPointCollection(spots, selectedId)}
        cluster
        clusterRadius={CLUSTER_RADIUS}
        clusterMaxZoomLevel={CLUSTER_MAX_ZOOM}
        hitbox={{ width: 44, height: 44 }}
        onPress={event => {
          const target = pickPressTarget(event.features as never);
          if (target.kind === 'cluster') {
            zoomIntoCluster(target.feature, target.center);
          } else if (target.kind === 'spot') {
            onSelectSpot?.(target.id);
          }
        }}
      >
        <CircleLayer
          id="spots-clusters"
          filter={['has', 'point_count']}
          style={{
            circleColor: mapColors.clusterFill,
            circleStrokeColor: mapColors.clusterStroke,
            circleStrokeWidth: 2,
            circleRadius: ['step', ['get', 'point_count'], 18, 10, 22, 50, 26],
          }}
        />
        <SymbolLayer
          id="spots-cluster-count"
          filter={['has', 'point_count']}
          style={{
            textField: [
              'case',
              ['>', ['get', 'point_count'], 99],
              '99+',
              ['to-string', ['get', 'point_count']],
            ],
            textFont: CLUSTER_FONT,
            textSize: 14,
            textColor: mapColors.clusterText,
            textAllowOverlap: true,
          }}
        />
        <SymbolLayer
          id="spots-pin-border"
          filter={['!', ['has', 'point_count']]}
          style={{
            textField: ['get', 'label'],
            textFont: PIN_FONT,
            textSize: 13,
            textColor: mapColors.pinBorder,
            textHaloColor: mapColors.pinBorder,
            textHaloWidth: 6,
            textAllowOverlap: true,
          }}
        />
        <SymbolLayer
          id="spots-pin"
          filter={['!', ['has', 'point_count']]}
          style={{
            textField: ['get', 'label'],
            textFont: PIN_FONT,
            textSize: 13,
            textColor: mapColors.pinText,
            textHaloColor: mapColors.pinSurface,
            textHaloWidth: 4.5,
            textAllowOverlap: true,
          }}
        />
      </ShapeSource>

      {/* O pico selecionado nunca entra em cluster: pin maior e acessível. */}
      {selected && selectedCenter ? (
        <MarkerView id={`spot-${selected.id}`} coordinate={selectedCenter}>
          <SpotPin
            spot={selected}
            selected
            onPress={() => onSelectSpot?.(selected.id)}
          />
        </MarkerView>
      ) : null}

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
