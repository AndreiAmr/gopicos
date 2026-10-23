import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { MapRef, MapMouseEvent } from 'react-map-gl/mapbox';

import { listSpotsActions } from '@/store/spot/modules/listSpots/listSpotsActions';
import { listSpotsSelectors } from '@/store/spot/modules/listSpots/listSpotsSelectors';
import { useMapLocation } from '@/hooks/useMapLocation';
import { prefersReducedMotion, useMediaQuery } from '@/hooks/useMediaQuery';
import {
  distanceKm,
  drawableSpots,
  formatDistance,
  polygonCenter,
  type SpotSummary,
} from '@/domain/spot/spot';
import { URL } from '@/routes/url';
import { loadViewport, saveViewport } from '@/utils/mapViewport';
import type { ViewStateChangeEvent } from 'react-map-gl/mapbox';
import { CLUSTER_SOURCE_ID } from '@/components/map/spotsLayers/constants';
import type { GeoJSONSource } from 'mapbox-gl';
import { announceSpot, cycleSpot, pickClickTarget } from './logic';

export const useHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  useMapLocation({ mapRef });

  const rawSpots = useSelector(listSpotsSelectors.getListSpots);
  const isLoading = useSelector(listSpotsSelectors.getIsLoadingListSpots);
  const isError = useSelector(listSpotsSelectors.getIsErrorListSpots);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [announcement, setAnnouncement] = useState('');
  const isWide = useMediaQuery('(min-width: 1024px)');

  const spots = useMemo<SpotSummary[]>(
    () =>
      (rawSpots ?? []).map((spot) => ({
        id: spot.id,
        name: spot.name,
        modality: spot.modality,
        images: (spot.images ?? []).map((image) => image ?? null),
        coordinates: spot.coordinates,
        ratingAverage: spot.ratingAverage ?? null,
        reviewsCount: spot.reviewsCount ?? 0,
      })),
    [rawSpots],
  );

  const fetchSpots = useCallback(() => {
    dispatch(listSpotsActions.getListSpotsAsync());
  }, [dispatch]);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const selected = useMemo(
    () => spots.find((spot) => spot.id === selectedId) ?? null,
    [spots, selectedId],
  );
  const selectedCenter = selected ? polygonCenter(selected.coordinates) : null;

  const distanceLabel = useMemo(
    () =>
      selectedCenter && userPosition
        ? formatDistance(distanceKm(userPosition, selectedCenter))
        : undefined,
    [selectedCenter, userPosition],
  );

  const clearSelection = useCallback(() => setSelectedId(null), []);

  const flyTo = useCallback((center: [number, number]) => {
    const map = mapRef.current;
    if (!map) return;
    if (prefersReducedMotion()) {
      map.jumpTo({ center });
    } else {
      map.easeTo({ center, duration: 400 });
    }
  }, []);

  // Cluster: aproxima até expandi-lo (animação curta; sem animação com
  // "reduzir movimento"). Não abre o resumo.
  const zoomIntoCluster = useCallback(
    (clusterId: number, center: [number, number]) => {
      const map = mapRef.current?.getMap();
      const source = map?.getSource(CLUSTER_SOURCE_ID) as
        | GeoJSONSource
        | undefined;
      source?.getClusterExpansionZoom(clusterId, (error, zoom) => {
        if (error || zoom == null) return;
        if (prefersReducedMotion()) {
          map?.jumpTo({ center, zoom });
        } else {
          map?.easeTo({ center, zoom, duration: 400 });
        }
      });
    },
    [],
  );

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      const target = pickClickTarget(event.features);
      if (target.kind === 'cluster') {
        zoomIntoCluster(target.clusterId, target.center);
      } else {
        setSelectedId(target.kind === 'spot' ? target.id : null);
      }
    },
    [zoomIntoCluster],
  );

  const visibleSpots = useCallback(() => {
    const drawable = drawableSpots(spots);
    const bounds = mapRef.current?.getBounds();
    if (!bounds) return drawable;
    const inside = drawable.filter((spot) => {
      const center = polygonCenter(spot.coordinates);
      return center ? bounds.contains(center) : false;
    });
    return inside.length > 0 ? inside : drawable;
  }, [spots]);

  // Equivalente do mapa por teclado (UX-F2): ] e [ percorrem, Enter abre, Esc fecha.
  const handleMapKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;

      if (event.key === ']' || event.key === '[') {
        event.preventDefault();
        const list = visibleSpots();
        const next = cycleSpot(
          list.map((spot) => spot.id),
          selectedId,
          event.key === ']' ? 1 : -1,
        );
        if (!next) return;
        const spot = list[next.position - 1];
        setSelectedId(next.id);
        setAnnouncement(announceSpot(spot, next.position, list.length));
        const center = polygonCenter(spot.coordinates);
        if (center) flyTo(center);
      } else if (event.key === 'Enter' && selectedId) {
        event.preventDefault();
        navigate(`/spot/${selectedId}`);
      }
    },
    [flyTo, navigate, selectedId, visibleSpots],
  );

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  // Voltar do detalhe reabre o mapa onde a pessoa estava (UX-F4).
  const initialViewState = useMemo(() => loadViewport() ?? undefined, []);
  const handleMoveEnd = useCallback((event: ViewStateChangeEvent) => {
    const { longitude, latitude, zoom } = event.viewState;
    saveViewport({ longitude, latitude, zoom });
  }, []);

  const createSpot = useCallback(() => navigate(URL.NEW_SPOT), [navigate]);

  const isEmpty = !isLoading && !isError && spots.length === 0;

  return {
    mapRef,
    spots,
    selected,
    selectedId,
    selectedCenter,
    distanceLabel,
    isWide,
    isLoading,
    isError,
    isEmpty,
    announcement,
    setUserPosition,
    clearSelection,
    handleMapClick,
    handleMapKeyDown,
    initialViewState,
    handleMoveEnd,
    createSpot,
    retry: fetchSpots,
  };
};
