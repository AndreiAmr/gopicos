import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSpotsQuery } from '../../../hooks/query/spots/useSpotsQuery';
import { clearSession } from '../../../services/session';
import {
  distanceKm,
  formatDistance,
  polygonCenter,
} from '../../../domain/spot/spot';
import type { RootStackParamList } from '../../../routes/types';

export const homeStrings = {
  loading: 'Carregando picos...',
  error: 'Não foi possível carregar os picos. Verifique sua conexão.',
  emptyTitle: 'Nenhum pico por aqui ainda',
  emptyDescription: 'Seja o primeiro a cadastrar um pico nesta região.',
  emptyAction: 'Cadastrar o primeiro pico',
  createSpot: 'Cadastrar novo pico',
} as const;

export const useHome = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { spots, loading, error, unauthenticated, refetch } = useSpotsQuery();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  // Controla o sheet do estado vazio. O vazio é um estado persistente (não um
  // evento): abrimos quando ele aparece e deixamos o usuário fechar por gesto.
  const [emptySheetOpen, setEmptySheetOpen] = useState(true);

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

  const selected = useMemo(
    () => spots.find(spot => spot.id === selectedId) ?? null,
    [spots, selectedId],
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

  const empty = !loading && !error && spots.length === 0;

  // Enquanto o vazio persistir, cada nova transição para "vazio" reabre o
  // sheet. Fechar por gesto é respeitado até a Home sair e voltar ao vazio.
  useEffect(() => {
    if (empty) {
      setEmptySheetOpen(true);
    }
  }, [empty]);

  return {
    spots,
    selected,
    selectedId,
    distanceLabel,
    // Mostra "Carregando" só na primeira carga; depois mantém o último resultado.
    loading: loading && spots.length === 0,
    hasError: error && !unauthenticated,
    isEmpty: empty,
    select: setSelectedId,
    clearSelection: () => setSelectedId(null),
    emptySheetOpen,
    dismissEmptySheet: () => setEmptySheetOpen(false),
    setUserPosition,
    openDetails,
    createSpot,
    retry: refetch,
  };
};
