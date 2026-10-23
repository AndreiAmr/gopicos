import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSpotsQuery } from '../../../hooks/query/spots/useSpotsQuery';
import { clearSession } from '../../../services/session';
import {
  distanceKm,
  formatDistance,
  polygonCenter,
} from '../../../domain/spot/spot';
import {
  NO_FILTERS,
  SpotFilters,
  activeFilterCount,
  applyFilters as filterSpots,
  filterByModalities,
  hasActiveFilters,
  sameFilters,
  scoreTape,
  toQueryFilter,
} from '../../../domain/spot/filters';
import { MapBounds, countInArea } from '../../../domain/map/area';
import { CameraTarget, Place, cameraTarget } from '../../../domain/place/place';
import type { RootStackParamList } from '../../../routes/types';

export const homeStrings = {
  error: 'Não foi possível carregar os picos.',
  offline: 'Sem conexão. Os picos não foram atualizados.',
  retry: 'Tentar novamente',
  mapError: 'Não foi possível carregar o mapa. Tente novamente mais tarde.',
  emptyTitle: 'Nenhum pico por aqui',
  emptyDescription: 'Conhece um pico nessa área? Marca ele aí pra galera.',
  emptyAction: 'Cadastrar o primeiro pico',
  filteredEmptyTitle: 'Nada com esses filtros',
  filteredEmptyDescription: 'Tente mudar ou limpar os filtros.',
  filteredEmptyAction: 'Limpar filtros',
  createSpot: 'Cadastrar novo pico',
  summary: 'Resumo do pico',
  closeSummary: 'Fechar resumo',
  viewDetails: 'Ver detalhes',
} as const;

export const useHome = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filters, setFilters] = useState<SpotFilters>(NO_FILTERS);
  const previousFilters = useRef<SpotFilters>(NO_FILTERS);
  const [applying, setApplying] = useState(false);
  const [applyFailed, setApplyFailed] = useState(false);
  const {
    spots: fetchedSpots,
    loading,
    error,
    offline,
    unauthenticated,
    refetch,
  } = useSpotsQuery(toQueryFilter(filters));
  // Todos os picos, sem filtro: base da prévia ao vivo dos filtros (UX-H19).
  // Sem filtro ativo é a mesma consulta (o Apollo não repete a requisição).
  const { spots: allSpots } = useSpotsQuery(null);
  // O backend filtra uma modalidade; o OU entre várias é feito aqui.
  const spots = useMemo(
    () => filterByModalities(fetchedSpots, filters.modalities),
    [fetchedSpots, filters.modalities],
  );

  /** Rascunho do sheet de filtros aberto (prévia); `null` fora do sheet. */
  const [preview, setPreview] = useState<SpotFilters | null>(null);
  /** Área visível do mapa, atualizada quando a câmera para. */
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [placeTarget, setPlaceTarget] = useState<CameraTarget | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Controla o sheet do estado vazio. O vazio é um estado persistente (não um
  // evento): abrimos quando ele aparece e deixamos o usuário fechar por gesto.
  const [emptySheetOpen, setEmptySheetOpen] = useState(true);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => undefined);
  }, []);

  // Sessão expirada: limpa o token e volta ao Login com o aviso.
  useEffect(() => {
    if (unauthenticated) {
      clearSession()
        .catch(() => undefined)
        .finally(() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
          }),
        );
    }
  }, [unauthenticated, navigation]);

  // Com o sheet de filtros aberto, os pins e a contagem mostram a prévia.
  const shownSpots = useMemo(
    () => (preview ? filterSpots(allSpots, preview) : spots),
    [preview, allSpots, spots],
  );
  const shownFilters = preview ?? filters;

  const selected = useMemo(
    () => shownSpots.find(spot => spot.id === selectedId) ?? null,
    [shownSpots, selectedId],
  );

  const distanceLabel = useMemo(() => {
    const center = selected ? polygonCenter(selected.coordinates) : null;
    if (!center || !userPosition) {
      return undefined;
    }
    return formatDistance(distanceKm(userPosition, center));
  }, [selected, userPosition]);

  const openDetails = useCallback(() => {
    if (selected) {
      navigation.navigate('SpotDetails', { id: selected.id });
    }
  }, [navigation, selected]);

  const createSpot = useCallback(() => {
    navigation.navigate('NewSpotLocation');
  }, [navigation]);

  // Terminou de aplicar; se falhou, volta ao filtro anterior e avisa (spec 8).
  useEffect(() => {
    if (!applying) return;
    if (error) {
      setFilters(previousFilters.current);
      setApplying(false);
      setApplyFailed(true);
    } else if (!loading) {
      setApplying(false);
    }
  }, [applying, error, loading]);

  const applyFilters = useCallback(
    (next: SpotFilters) => {
      if (sameFilters(next, filters)) return;
      previousFilters.current = filters;
      setApplyFailed(false);
      setApplying(true);
      setSelectedId(null);
      setFilters(next);
    },
    [filters],
  );

  const firstLoad = loading && spots.length === 0;
  const hasError = error && !unauthenticated;
  const areaCount = countInArea(shownSpots, bounds);
  const filterCount = activeFilterCount(shownFilters);
  const tape = scoreTape({
    loading: firstLoad,
    updating: applying,
    count: areaCount,
    filterCount,
  });

  // "Vazio" é da área visível; antes de saber a área, da lista inteira.
  const empty =
    !firstLoad &&
    !hasError &&
    !applying &&
    (bounds ? areaCount === 0 : spots.length === 0);

  // Enquanto o vazio persistir, cada nova transição para "vazio" reabre o
  // sheet. Fechar por gesto é respeitado até a Home sair e voltar ao vazio.
  useEffect(() => {
    if (empty) {
      setEmptySheetOpen(true);
    }
  }, [empty]);

  return {
    spots: shownSpots,
    allSpots,
    selected,
    selectedId,
    distanceLabel,
    // Mostra "Carregando" só na primeira carga; depois mantém o último resultado.
    loading: firstLoad,
    hasError,
    offline,
    isEmpty: empty,
    emptyKind: hasActiveFilters(shownFilters)
      ? ('filtered' as const)
      : ('empty' as const),
    filters,
    shownFilters,
    filtersActive: hasActiveFilters(filters),
    filterCount,
    preview,
    setPreview,
    bounds,
    setBounds,
    areaCount,
    tape,
    applying,
    applyFailed,
    dismissApplyFailed: () => setApplyFailed(false),
    applyFilters,
    clearFilters: () => applyFilters(NO_FILTERS),
    select: (id: string) => {
      setPlaceTarget(null);
      setSelectedId(id);
    },
    placeTarget,
    placeAnimationMs: reduceMotion ? 0 : 800,
    reduceMotion,
    selectPlace: (place: Place) => {
      setSelectedId(null);
      setPlaceTarget(cameraTarget(place));
    },
    clearSelection: () => setSelectedId(null),
    emptySheetOpen,
    dismissEmptySheet: () => setEmptySheetOpen(false),
    userPosition,
    setUserPosition,
    openDetails,
    createSpot,
    retry: refetch,
  };
};
