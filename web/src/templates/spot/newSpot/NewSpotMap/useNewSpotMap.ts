import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox';

import { MIN_POINTS, pointsToPolygon } from '@/domain/spot/newSpotForm';
import type { Position } from '@/domain/spot/newSpotForm';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useNewSpotDraft } from '@/pages/_layouts/newSpotDraft';
import { URL } from '@/routes/url';
import { reverseGeocodingActions } from '@/store/reverseGeocoding/reverseGeocodingActions';
import { reverseGeocodingSelectors } from '@/store/reverseGeocoding/reverseGeocodingSelectors';
import { notify } from '@/lib/notify';
import { loadViewport } from '@/utils/mapViewport';

const isTyping = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;
  return Boolean(
    element?.closest('input, textarea, select, [contenteditable="true"]'),
  );
};

export const useNewSpotMap = () => {
  const mapRef = useRef<MapRef>(null);
  useMapLocation({ mapRef });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { points, setPoints } = useNewSpotDraft();
  const [announcement, setAnnouncement] = useState('');

  const address = useSelector(reverseGeocodingSelectors.getReverseGeocoding);
  const addressLoading = useSelector(
    reverseGeocodingSelectors.getIsLoadingReverseGeocoding,
  );

  const initialViewState = useMemo(() => loadViewport() ?? undefined, []);

  const firstPoint = points[0];
  useEffect(() => {
    if (!firstPoint) return;
    dispatch(
      reverseGeocodingActions.getReverseGeocodingAsync(
        firstPoint[1],
        firstPoint[0],
      ),
    );
  }, [dispatch, firstPoint]);

  const addPoint = useCallback(
    (position: Position) => {
      setPoints((current) => {
        setAnnouncement(`Ponto ${current.length + 1} adicionado`);
        return [...current, position];
      });
    },
    [setPoints],
  );

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => addPoint([event.lngLat.lng, event.lngLat.lat]),
    [addPoint],
  );

  const addCenterPoint = useCallback(() => {
    const center = mapRef.current?.getCenter();
    if (center) addPoint([center.lng, center.lat]);
  }, [addPoint]);

  const movePoint = useCallback(
    (index: number, position: Position) =>
      setPoints((current) =>
        current.map((point, i) => (i === index ? position : point)),
      ),
    [setPoints],
  );

  const undo = useCallback(() => {
    setPoints((current) => current.slice(0, -1));
    setAnnouncement('Último ponto removido');
  }, [setPoints]);

  const clear = useCallback(() => {
    setPoints([]);
    setAnnouncement('Pontos removidos');
  }, [setPoints]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      notify.info('Permita o acesso à localização no navegador para usar sua posição.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: Position = [coords.longitude, coords.latitude];
        mapRef.current?.flyTo({ center: position, zoom: 18 });
        addPoint(position);
      },
      () =>
        notify.info(
          'Permita o acesso à localização no navegador para usar sua posição.',
        ),
    );
  }, [addPoint]);

  // Backspace / Ctrl+Z desfazem o último ponto (fora de campos de texto).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return;
      const isUndo =
        event.key === 'Backspace' ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z');
      if (!isUndo) return;
      event.preventDefault();
      undo();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo]);

  // Enter com o mapa focado adiciona ponto sob a mira central.
  const handleMapKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter' || event.target !== event.currentTarget) return;
      event.preventDefault();
      addCenterPoint();
    },
    [addCenterPoint],
  );

  const canContinue = points.length >= MIN_POINTS;

  const goNext = useCallback(() => {
    if (canContinue) navigate(URL.NEW_SPOT_DETAILS);
  }, [canContinue, navigate]);

  const geojson = useMemo(() => {
    if (points.length >= MIN_POINTS) {
      return { type: 'Feature', properties: {}, geometry: pointsToPolygon(points) } as const;
    }
    if (points.length === 2) {
      return {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: points },
      } as const;
    }
    return null;
  }, [points]);

  return {
    mapRef,
    initialViewState,
    points,
    geojson,
    address,
    addressLoading,
    announcement,
    canContinue,
    handleMapClick,
    handleMapKeyDown,
    addCenterPoint,
    movePoint,
    undo,
    clear,
    locateMe,
    goNext,
  };
};
