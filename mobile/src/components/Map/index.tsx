import { forwardRef, useImperativeHandle, useRef } from 'react';
import Mapbox, {
  type FillLayerStyle,
  type LineLayerStyle,
  type MapState,
  type SymbolLayerStyle,
  Camera,
  FillLayer,
  LineLayer,
  LocationPuck,
  ShapeSource,
  StyleImport,
  SymbolLayer,
  UserLocation,
} from '@rnmapbox/maps';
import { useTheme } from 'tamagui';
import * as S from './styles';
import { MapBounds, isValidCoordinate } from '../../domain/map/area';
import { ColorScheme, MapLayer, mapStyleFor } from '../../domain/map/layers';
import {
  PIN_LABELS,
  SpotSummary,
  buildPointCollection,
  buildPolygonCollection,
  pickPressTarget,
  pinText,
  polygonCenter,
} from '../../domain/spot/spot';
import {
  CLUSTER_SIZES,
  MapImages,
  MapImagesHandle,
  pinImageExpression,
} from './MapImages';

/** A partir deste zoom os polígonos aparecem; mais longe, só os pins. */
const POLYGON_MIN_ZOOM = 15;
/** Cluster nativo (spec 11): raio em px e zoom a partir do qual todo pico aparece solto. */
const CLUSTER_RADIUS = 50;
const CLUSTER_MAX_ZOOM = 14;
/** Alvo de toque mínimo dos pins (44). */
const HITBOX = { width: 44, height: 44 };
const CLUSTER_FONT = ['DIN Pro Bold', 'Arial Unicode MS Bold'];
/** Centro inicial antes de saber onde a pessoa está (São Paulo). */
const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];
const DEFAULT_ZOOM = 11;
/** Zoom ao centralizar na pessoa ou num lugar sem caixa. */
export const USER_ZOOM = 14;

export type CameraPadding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type MapHandle = {
  centerOn: (
    coordinate: [number, number],
    options?: { zoom?: number; duration?: number; padding?: CameraPadding },
  ) => void;
  fitBounds: (
    bounds: MapBounds,
    padding: CameraPadding,
    duration?: number,
  ) => void;
};

type MapProps = {
  spots?: SpotSummary[];
  selectedId?: string | null;
  onSelectSpot?: (id: string) => void;
  onMapPress?: () => void;
  layer?: MapLayer;
  scheme?: ColorScheme;
  /** Mostra a posição da pessoa (só com permissão concedida). */
  showUserLocation?: boolean;
  /** Posição do usuário em [lng, lat]. */
  onUserLocation?: (position: [number, number]) => void;
  /** A pessoa arrastou ou deu zoom (o botão de localização sai de "centralizado"). */
  onUserGesture?: () => void;
  /** Câmera parada: área visível, para a contagem "na área". */
  onIdle?: (bounds: MapBounds) => void;
  /** Distância da base do mapa até o logo e o "i" do Mapbox (Z3). */
  ornamentBottom?: number;
  /** Falha ao carregar o estilo (ex.: satélite sem rede). */
  onStyleError?: () => void;
  onStyleLoaded?: () => void;
  /** Duração da aproximação ao tocar num cluster (0 com "reduzir movimento"). */
  clusterAnimationMs?: number;
};

const toPadding = (padding?: CameraPadding) =>
  padding
    ? {
        paddingTop: padding.top,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
        paddingRight: padding.right,
      }
    : undefined;

export const Map = forwardRef<MapHandle, MapProps>(
  (
    {
      spots = [],
      selectedId = null,
      onSelectSpot,
      onMapPress,
      layer = 'street',
      scheme = 'light',
      showUserLocation = false,
      onUserLocation,
      onUserGesture,
      onIdle,
      ornamentBottom = 8,
      onStyleError,
      onStyleLoaded,
      clusterAnimationMs = 400,
    },
    ref,
  ) => {
    const theme = useTheme();
    const cameraRef = useRef<Mapbox.Camera>(null);
    const pointsRef = useRef<Mapbox.ShapeSource>(null);
    const imagesRef = useRef<MapImagesHandle>(null);

    useImperativeHandle(
      ref,
      () => ({
        centerOn: (coordinate, options) => {
          if (!isValidCoordinate(coordinate)) return;
          cameraRef.current?.setCamera({
            centerCoordinate: coordinate,
            zoomLevel: options?.zoom,
            padding: toPadding(options?.padding),
            animationDuration: options?.duration ?? 600,
            animationMode: options?.duration === 0 ? 'none' : 'easeTo',
          });
        },
        fitBounds: (bounds, padding, duration = 800) => {
          if (!isValidCoordinate(bounds.ne) || !isValidCoordinate(bounds.sw))
            return;
          cameraRef.current?.setCamera({
            bounds: { ne: bounds.ne, sw: bounds.sw },
            padding: toPadding(padding),
            animationDuration: duration,
            animationMode: duration === 0 ? 'none' : 'flyTo',
          });
        },
      }),
      [],
    );

    // Toque num cluster aproxima o mapa até expandi-lo; não abre o resumo.
    const zoomIntoCluster = async (
      feature: unknown,
      center: [number, number],
    ) => {
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
    const selectedCenter = selected
      ? polygonCenter(selected.coordinates)
      : null;
    const style = mapStyleFor(layer, scheme);

    // Uma imagem por rótulo possível ("★ 4,6", "Novo"), fixa: imagens montadas
    // depois que o mapa carregou não entram no estilo e os pins somem (GP-132).
    const labels = PIN_LABELS;

    // Estilos das camadas (cores do tema; fora do JSX).
    const layerStyles: {
      fill: FillLayerStyle;
      line: LineLayerStyle;
      lineSelected: LineLayerStyle;
      clusters: SymbolLayerStyle;
      pin: SymbolLayerStyle;
      pinSelected: SymbolLayerStyle;
    } = {
      fill: {
        fillColor: theme.primary.val,
        fillOpacity: ['case', ['get', 'selected'], 0.38, 0.22],
      },
      line: { lineColor: theme.primary.val, lineWidth: 2 },
      lineSelected: {
        lineColor: theme.primaryText.val,
        lineWidth: 3,
        lineDasharray: [2, 1],
      },
      clusters: {
        iconImage: [
          'step',
          ['get', 'point_count'],
          'cluster-s',
          10,
          'cluster-m',
          50,
          'cluster-l',
        ],
        iconAllowOverlap: true,
        iconIgnorePlacement: true,
        textField: [
          'case',
          ['>', ['get', 'point_count'], 99],
          '99+',
          ['to-string', ['get', 'point_count']],
        ],
        textFont: CLUSTER_FONT,
        textSize: 13,
        textColor: theme.onPrimary.val,
        textAllowOverlap: true,
        textIgnorePlacement: true,
        // A imagem tem o contorno e a sombra; o centro do círculo fica 1 px à esquerda/acima.
        textOffset: [-0.08, -0.08],
      },
      pin: {
        iconImage: pinImageExpression(labels) as never,
        iconAllowOverlap: true,
        iconIgnorePlacement: true,
      },
      pinSelected: {
        iconImage: pinImageExpression(labels, true) as never,
        iconRotate: -3,
        iconAllowOverlap: true,
        iconIgnorePlacement: true,
      },
    };

    const ornament = { bottom: ornamentBottom, left: 8 };

    const emitBounds = (state: MapState) => {
      const bounds = state?.properties?.bounds;
      if (isValidCoordinate(bounds?.ne) && isValidCoordinate(bounds?.sw)) {
        const center = state?.properties?.center;
        onIdle?.({
          ne: [bounds.ne[0], bounds.ne[1]],
          sw: [bounds.sw[0], bounds.sw[1]],
          center: isValidCoordinate(center)
            ? [center[0], center[1]]
            : undefined,
          zoom: state?.properties?.zoom,
        });
      }
    };

    return (
      <S.MapContainer
        styleURL={style.styleURL}
        scaleBarEnabled={false}
        compassEnabled={false}
        // Logo e atribuição são obrigatórios pelos termos do Mapbox (UX-H16).
        logoEnabled
        logoPosition={ornament}
        attributionEnabled
        attributionPosition={{ bottom: ornamentBottom, left: 96 }}
        onPress={() => onMapPress?.()}
        onCameraChanged={state => {
          if (state.gestures?.isGestureActive) {
            onUserGesture?.();
          }
          // O `onMapIdle` não chega no iOS com a New Architecture: quem chama
          // espera a câmera parar (debounce) antes de recontar.
          emitBounds(state);
        }}
        onMapIdle={emitBounds}
        onMapLoadingError={onStyleError}
        onDidFinishLoadingStyle={() => {
          // Estilo novo (ou o primeiro): refaz as imagens dos pins e clusters.
          imagesRef.current?.refreshAll();
          onStyleLoaded?.();
        }}
        onDidFinishLoadingMap={() => imagesRef.current?.refreshAll()}
        testID="home-map"
      >
        {/* Rua e Concreto: Standard com dia/noite e tema monocromático (seção 12). */}
        <StyleImport id="basemap" existing config={style.config} />

        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: DEFAULT_CENTER,
            zoomLevel: DEFAULT_ZOOM,
          }}
        />

        <MapImages ref={imagesRef} labels={labels} scheme={scheme} />

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
            style={layerStyles.fill}
          />
          <LineLayer
            id="spots-line"
            minZoomLevel={POLYGON_MIN_ZOOM}
            filter={['!', ['get', 'selected']]}
            style={layerStyles.line}
          />
          {/* Selecionado: contorno 3 px `primary-text` tracejado 6/3. */}
          <LineLayer
            id="spots-line-selected"
            minZoomLevel={POLYGON_MIN_ZOOM}
            filter={['get', 'selected']}
            style={layerStyles.lineSelected}
          />
        </ShapeSource>

        <ShapeSource
          id="spots-points"
          ref={pointsRef}
          shape={buildPointCollection(spots, selectedId)}
          cluster
          clusterRadius={CLUSTER_RADIUS}
          clusterMaxZoomLevel={CLUSTER_MAX_ZOOM}
          hitbox={HITBOX}
          onPress={event => {
            const target = pickPressTarget(event.features as never);
            if (target.kind === 'cluster') {
              zoomIntoCluster(target.feature, target.center);
            } else if (target.kind === 'spot') {
              onSelectSpot?.(target.id);
            }
          }}
        >
          <SymbolLayer
            id="spots-clusters"
            filter={['has', 'point_count']}
            style={layerStyles.clusters}
          />
          <SymbolLayer
            id="spots-pin"
            filter={['!', ['has', 'point_count']]}
            style={layerStyles.pin}
          />
        </ShapeSource>

        {/*
          O pico selecionado nunca entra em cluster: pin maior, laranja e girado.
          É uma camada de símbolo (não MarkerView), que o SDK sempre desenha.
        */}
        <ShapeSource
          id="spots-selected"
          shape={{
            type: 'FeatureCollection',
            features:
              selected && selectedCenter
                ? [
                    {
                      type: 'Feature',
                      id: selected.id,
                      properties: { id: selected.id, label: pinText(selected) },
                      geometry: { type: 'Point', coordinates: selectedCenter },
                    },
                  ]
                : [],
          }}
          hitbox={HITBOX}
          onPress={event => {
            const id = event.features[0]?.properties?.id;
            if (id) onSelectSpot?.(String(id));
          }}
        >
          <SymbolLayer
            id="spots-pin-selected"
            style={layerStyles.pinSelected}
          />
        </ShapeSource>

        {showUserLocation ? (
          <>
            <LocationPuck
              puckBearing="heading"
              puckBearingEnabled
              pulsing={{ isEnabled: true }}
            />
            <UserLocation
              visible={false}
              onUpdate={location => {
                const position = [
                  location?.coords?.longitude,
                  location?.coords?.latitude,
                ];
                if (isValidCoordinate(position)) {
                  onUserLocation?.(position);
                }
              }}
            />
          </>
        ) : null}
      </S.MapContainer>
    );
  },
);

Map.displayName = 'Map';

export { CLUSTER_SIZES };
