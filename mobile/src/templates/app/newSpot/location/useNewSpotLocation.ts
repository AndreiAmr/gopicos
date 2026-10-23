import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from '../../../../atomic/ds/molecules/Toast';
import {
  LngLat,
  addPoint,
  canContinue,
  movePoint,
  pointsCountText,
  toPolygon,
  undoPoint,
} from '../../../../domain/spot/polygonDraft';
import type { RootStackParamList } from '../../../../routes/types';

export const newSpotLocationStrings = {
  header: 'Passo 1 de 2 - Marque o local',
  instruction:
    'Toque no mapa para marcar os cantos do pico. Arraste um ponto para ajustar.',
  addCenter: 'Adicionar ponto no centro do mapa',
  undo: 'Desfazer',
  clear: 'Limpar',
  useMyLocation: 'Usar minha posição',
  continue: 'Continuar',
  noLocation: 'Ative a localização para usar a sua posição.',
  discardTitle: 'Descartar o local marcado?',
  discard: 'Descartar',
  keepEditing: 'Continuar editando',
  back: 'Voltar',
} as const;

export const useNewSpotLocation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();

  const [points, setPoints] = useState<LngLat[]>([]);
  const [center, setCenter] = useState<LngLat | null>(null);
  const [userPosition, setUserPosition] = useState<LngLat | null>(null);
  /** Centro pedido à câmera ("Usar minha posição"). */
  const [focus, setFocus] = useState<LngLat | null>(null);

  const add = useCallback((point: LngLat) => {
    setPoints(current => {
      const next = addPoint(current, point);
      AccessibilityInfo.announceForAccessibility(
        `Ponto ${next.length} adicionado`,
      );
      return next;
    });
  }, []);

  const addAtCenter = useCallback(() => {
    if (center) add(center);
  }, [add, center]);

  const useMyLocation = useCallback(() => {
    if (!userPosition) {
      toast.show({ type: 'info', message: newSpotLocationStrings.noLocation });
      return;
    }
    setFocus(userPosition);
    add(userPosition);
  }, [add, toast, userPosition]);

  const move = useCallback((index: number, point: LngLat) => {
    setPoints(current => movePoint(current, index, point));
  }, []);

  // Sair com pontos marcados pede confirmação (voltar, gesto).
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (points.length === 0) return;

      event.preventDefault();
      Alert.alert(newSpotLocationStrings.discardTitle, undefined, [
        { text: newSpotLocationStrings.keepEditing, style: 'cancel' },
        {
          text: newSpotLocationStrings.discard,
          style: 'destructive',
          onPress: () => navigation.dispatch(event.data.action),
        },
      ]);
    });

    return unsubscribe;
  }, [navigation, points.length]);

  const goNext = useCallback(() => {
    const polygon = toPolygon(points);
    if (polygon) {
      // O passo 1 fica na pilha: "Alterar" no passo 2 volta sem perder os pontos.
      navigation.navigate('NewSpotDetails', { coordinates: polygon });
    }
  }, [navigation, points]);

  return {
    points,
    focus,
    countText: pointsCountText(points.length),
    canContinue: canContinue(points),
    add,
    addAtCenter,
    undo: () => setPoints(undoPoint),
    clear: () => setPoints([]),
    move,
    useMyLocation,
    setCenter,
    setUserPosition,
    goNext,
    goBack: () => navigation.goBack(),
  };
};
