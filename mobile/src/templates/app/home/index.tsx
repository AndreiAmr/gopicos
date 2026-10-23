import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, useThemeName } from 'tamagui';
import * as S from './styles';
import { Map, MapHandle, USER_ZOOM } from '../../../components/Map';
import { AlertBanner, ScoreTape, useToast } from '../../../atomic/ds';
import { space, zIndex } from '../../../config/tamagui/tokens';
import { isMapboxConfigured } from '../../../config/mapbox';
import { useTabBarHeight } from '../../../routes/HomeStack/TabBar';
import { ActiveChips, FilterButton } from './components/Filters/FilterBar';
import { FilterSheet } from './components/Filters/FilterSheet';
import { LayersSheet } from './components/LayersSheet';
import { ControlColumn } from './components/ControlColumn';
import {
  EmptySheet,
  LocationPermissionSheet,
  SpotSummarySheet,
} from './components/HomeSheets';
import { PlaceSearch } from './components/PlaceSearch';
import {
  SpotFilters,
  applyFilters as filterSpots,
  filterStrings,
  scoreTapeText,
} from '../../../domain/spot/filters';
import { countInArea, spotsBounds } from '../../../domain/map/area';
import { locationStrings } from '../../../domain/map/location';
import { polygonCenter } from '../../../domain/spot/spot';
import { openAppSettings } from '../../../services/location/permission';
import { homeStrings, useHome } from './useHome';
import { useMapLayer } from './useMapLayer';
import { useLocationControl } from './useLocationControl';
import {
  CONTROL_SIZE,
  GUTTER,
  ORNAMENT_GAP,
  sheetOverlap,
  toastZone,
} from './layout';

type ModalSheet = 'filters' | 'layers' | 'permission';

/** Peek do resumo antes da primeira medição (spec 4.1). */
const DEFAULT_PEEK = 188;
/** Espera da contagem depois que a câmera para (spec 6.1). */
const IDLE_DEBOUNCE_MS = 300;

export const HomeTemplate = () => {
  const home = useHome();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const tabBarHeight = useTabBarHeight();
  const themeName = useThemeName();
  const scheme = themeName.startsWith('dark') ? 'dark' : 'light';
  const navigation = useNavigation<BottomTabNavigationProp<Record<string, undefined>>>();
  const isFocused = useIsFocused();

  const mapRef = useRef<MapHandle>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const layersSheetRef = useRef<BottomSheetModal>(null);
  const permissionSheetRef = useRef<BottomSheetModal>(null);

  const [modal, setModal] = useState<ModalSheet | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [peekHeight, setPeekHeight] = useState(DEFAULT_PEEK);
  const [overlap, setOverlap] = useState(0);
  const [z1BottomJS, setZ1BottomJS] = useState(insets.top + 8 + 48 + 8 + 48);

  // Referencial do mapa: topo da tela até o topo da tab bar.
  const mapHeight = useSharedValue(window.height - tabBarHeight);
  const z1Bottom = useSharedValue(z1BottomJS);
  const summaryTop = useSharedValue(window.height);
  const emptyTop = useSharedValue(window.height);
  const [mapHeightJS, setMapHeightJS] = useState(window.height - tabBarHeight);

  const showError = useCallback(
    (message: string) => toast.show({ type: 'error', message }),
    [toast],
  );

  const layer = useMapLayer({ onError: showError });

  const cameraPadding = useCallback(
    (bottom: number) => ({
      top: z1BottomJS + space[2],
      bottom: bottom + space[4],
      left: GUTTER,
      right: GUTTER + CONTROL_SIZE + space[2],
    }),
    [z1BottomJS],
  );

  const openModal = useCallback((sheet: ModalSheet) => {
    setModal(sheet);
    const ref =
      sheet === 'filters'
        ? filterSheetRef
        : sheet === 'layers'
        ? layersSheetRef
        : permissionSheetRef;
    ref.current?.present();
  }, []);

  const location = useLocationControl({
    onCenter: position =>
      mapRef.current?.centerOn(position, {
        zoom: USER_ZOOM,
        duration: home.reduceMotion ? 0 : 600,
        padding: cameraPadding(overlap),
      }),
    onError: () => showError(locationStrings.error),
    onOpenPermissionSheet: () => openModal('permission'),
    onPosition: home.setUserPosition,
  });

  // A coluna, o logo do Mapbox e o toast acompanham o sheet aberto.
  useAnimatedReaction(
    () =>
      Math.round(
        sheetOverlap(mapHeight.value, Math.min(summaryTop.value, emptyTop.value)),
      ),
    (current, previous) => {
      if (previous === null || Math.abs(current - previous) >= 2) {
        runOnJS(setOverlap)(current);
      }
    },
  );

  // Falha ao aplicar: o filtro anterior permanece e a pessoa pode tentar de novo.
  useEffect(() => {
    if (!home.applyFailed) return;
    toast.show({
      type: 'error',
      message: filterStrings.applyError,
      actionLabel: filterStrings.retry,
      onActionPress: () => openModal('filters'),
    });
    home.dismissApplyFailed();
  }, [home, toast, openModal]);

  // Toast na zona Z4 enquanto a Home está em foco (UX-H11).
  useEffect(() => {
    if (!isFocused) return;
    toast.setPlacement(
      toastZone({
        tabBarHeight,
        overlap,
        mapHeight: mapHeightJS,
        z1Bottom: z1BottomJS,
        modalOpen: modal !== null || searchFocused,
      }),
    );
  }, [isFocused, toast, tabBarHeight, overlap, mapHeightJS, z1BottomJS, modal, searchFocused]);

  useFocusEffect(
    useCallback(() => {
      return () => toast.setPlacement(null);
    }, [toast]),
  );

  // Tocar na aba Mapa já ativa: fecha o resumo aberto (o modal já foi fechado pela tab bar).
  useEffect(
    () =>
      navigation.addListener('tabPress', () => {
        if (navigation.isFocused()) {
          home.clearSelection();
        }
      }),
    [navigation, home],
  );

  // Lugar buscado: a câmera voa até ele (sem animação com "reduzir movimento").
  useEffect(() => {
    const target = home.placeTarget;
    if (!target) return;
    // A câmera sai da pessoa: o botão volta a "Centralizar".
    location.onGesture();
    if (target.type === 'bounds') {
      mapRef.current?.fitBounds(
        { ne: target.ne, sw: target.sw },
        cameraPadding(0),
        home.placeAnimationMs,
      );
    } else {
      mapRef.current?.centerOn(target.center, {
        zoom: target.zoom,
        duration: home.placeAnimationMs,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home.placeTarget]);

  // Pico selecionado: centraliza na área livre, acima do resumo e longe da coluna.
  useEffect(() => {
    const center = home.selected ? polygonCenter(home.selected.coordinates) : null;
    if (center) {
      location.onGesture();
      mapRef.current?.centerOn(center, {
        duration: home.reduceMotion ? 0 : 400,
        padding: cameraPadding(peekHeight),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home.selectedId]);

  // Sem localização, o mapa abre enquadrando os picos (uma vez).
  const framed = useRef(false);
  useEffect(() => {
    if (framed.current || home.loading || location.showUserLocation) return;
    if (location.status !== 'idle' && location.status !== 'denied') return;
    const box = spotsBounds(home.allSpots);
    if (box) {
      framed.current = true;
      mapRef.current?.fitBounds(box, cameraPadding(0), 0);
    }
  }, [home.loading, home.allSpots, location.showUserLocation, location.status, cameraPadding]);

  // Contagem "na área" quando a câmera para (300 ms).
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdle = useCallback(
    (bounds: Parameters<typeof home.setBounds>[0]) => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => home.setBounds(bounds), IDLE_DEBOUNCE_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [home.setBounds],
  );
  useEffect(() => () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  const openFilters = () => {
    home.setPreview(home.filters);
    openModal('filters');
  };

  const previewCount = useMemo(
    () =>
      home.preview ? countInArea(filterSpots(home.allSpots, home.preview), home.bounds) : null,
    [home.preview, home.allSpots, home.bounds],
  );

  const availableHeight = window.height - (insets.top + space[2]) - tabBarHeight;
  const hideMapUi = searchFocused;
  const showError_ = home.hasError;
  const emptyOpen =
    home.isEmpty &&
    home.emptySheetOpen &&
    !home.selected &&
    !searchFocused &&
    home.preview === null;

  return (
    <S.Container
      onLayout={event => {
        const height = event.nativeEvent.layout.height;
        mapHeight.value = height;
        setMapHeightJS(height);
      }}
    >
      {isMapboxConfigured && layer.ready ? (
        <Map
          ref={mapRef}
          spots={home.spots}
          selectedId={home.selectedId}
          onSelectSpot={home.select}
          onMapPress={home.clearSelection}
          layer={layer.layer}
          scheme={scheme}
          showUserLocation={location.showUserLocation}
          onUserLocation={location.onFix}
          onUserGesture={location.onGesture}
          onIdle={onIdle}
          ornamentBottom={overlap + ORNAMENT_GAP}
          onStyleError={layer.onStyleError}
          onStyleLoaded={layer.onStyleLoaded}
          clusterAnimationMs={home.reduceMotion ? 0 : 400}
        />
      ) : null}

      {/* Z1: busca, linha de status e chips. */}
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        paddingTop={insets.top + space[2] + 48 + space[2]}
        gap={space[2]}
        zIndex={zIndex.header}
        pointerEvents="box-none"
        onLayout={event => {
          const bottom = event.nativeEvent.layout.height;
          z1Bottom.value = bottom;
          setZ1BottomJS(bottom);
        }}
        testID="home-header"
      >
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[3]}
          paddingHorizontal={GUTTER}
          minHeight={48}
          pointerEvents="box-none"
        >
          {!isMapboxConfigured ? (
            <View flex={1}>
              <AlertBanner type="error" message={homeStrings.mapError} testID="home-map-error" />
            </View>
          ) : showError_ ? (
            <View flex={1}>
              <AlertBanner
                type="error"
                message={home.offline ? homeStrings.offline : homeStrings.error}
                actionLabel={homeStrings.retry}
                onActionPress={home.retry}
                testID="home-error"
              />
            </View>
          ) : (
            <>
              <FilterButton
                filters={home.shownFilters}
                loading={home.applying}
                onOpen={openFilters}
              />
              <ScoreTape
                text={home.tape.text}
                detail={home.tape.kind === 'count' ? home.tape.filtersText : undefined}
                spinning={home.tape.kind === 'loading'}
                accessibilityLabel={scoreTapeText(home.tape)}
                testID={home.tape.kind === 'loading' ? 'home-loading' : 'score-tape'}
              />
            </>
          )}
        </View>
        {!showError_ && !home.loading ? (
          <ActiveChips filters={home.shownFilters} onChange={home.applyFilters} />
        ) : null}
      </View>

      <PlaceSearch
        onSelectPlace={home.selectPlace}
        onFocusChange={focused => {
          setSearchFocused(focused);
          if (focused) home.clearSelection();
        }}
      />

      {isMapboxConfigured ? (
        <ControlColumn
          layer={layer.layer}
          locationStatus={location.status}
          onLayers={() => openModal('layers')}
          onLocation={location.press}
          sheetTops={[summaryTop, emptyTop]}
          mapHeight={mapHeight}
          z1Bottom={z1Bottom}
          forceHidden={hideMapUi || modal !== null}
        />
      ) : null}

      <SpotSummarySheet
        spot={searchFocused ? null : home.selected}
        distanceLabel={home.distanceLabel}
        onViewDetails={home.openDetails}
        onClose={home.clearSelection}
        topInset={insets.top + space[2]}
        animatedPosition={summaryTop}
        peekHeight={peekHeight}
        onPeekHeight={setPeekHeight}
      />

      <EmptySheet
        open={emptyOpen}
        kind={home.emptyKind}
        onAction={home.emptyKind === 'filtered' ? home.clearFilters : home.createSpot}
        onClose={home.dismissEmptySheet}
        animatedPosition={emptyTop}
      />

      <FilterSheet
        ref={filterSheetRef}
        filters={home.filters}
        applying={home.applying}
        onApply={(next: SpotFilters) => home.applyFilters(next)}
        onDraftChange={draft => {
          home.setPreview(draft);
          if (draft === null) setModal(null);
        }}
        previewCount={previewCount}
        bottomInset={tabBarHeight}
        topInset={insets.top + space[2]}
        maxContentHeight={Math.round(availableHeight * 0.7)}
        expandedHeight={availableHeight}
      />

      <LayersSheet
        ref={layersSheetRef}
        layer={layer.layer}
        switching={layer.switching}
        dark={scheme === 'dark'}
        onChange={layer.setLayer}
        bottomInset={tabBarHeight}
        onClose={() => setModal(null)}
      />

      <LocationPermissionSheet
        ref={permissionSheetRef}
        bottomInset={tabBarHeight}
        onOpenSettings={openAppSettings}
        onClose={() => setModal(null)}
      />
    </S.Container>
  );
};
