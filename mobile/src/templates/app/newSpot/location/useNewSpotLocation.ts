import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from '../../../../atomic/ds/molecules/Toast';
import {
  LngLat,
  addPoint,
  canContinue,
  fromPolygon,
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

export const editSpotLocationStrings = {
  ...newSpotLocationStrings,
  header: 'Alterar local',
  continue: 'Usar este local',
  discardTitle: 'Descartar a alteração do local?',
} as const;

/** Modo edição: abre com o polígono atual do pico e devolve o novo ao formulário. */
export type EditLocation = {
  id: string;
  coordinates: { type: 'Polygon'; coordinates: number[][][] };
};

const centroid = (points: LngLat[]): LngLat | null =>
  points.length === 0
    ? null
    : [
        points.reduce((sum, p) => sum + p[0], 0) / points.length,
        points.reduce((sum, p) => sum + p[1], 0) / points.length,
      ];

export const useNewSpotLocation = (edit?: EditLocation) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();

  const initial = useRef<LngLat[]>(edit ? fromPolygon(edit.coordinates) : []);
  const done = useRef(false);
  const [points, setPoints] = useState<LngLat[]>(initial.current);
  const [center, setCenter] = useState<LngLat | null>(null);
  const [userPosition, setUserPosition] = useState<LngLat | null>(null);
  /** Centro pedido à câmera ("Usar minha posição"). */
  const [focus, setFocus] = useState<LngLat | null>(() =>
    centroid(initial.current),
  );

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

  // Sair com pontos marcados pede confirmação (voltar, gesto). Um RESET (o
  // envio do passo 2 com sucesso, ou a sessão expirada) sai direto: o local já
  // foi usado, não há o que descartar.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (
        done.current ||
        points.length === 0 ||
        event.data.action.type === 'RESET' ||
        JSON.stringify(points) === JSON.stringify(initial.current)
      ) {
        return;
      }

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
  }, [navigation, points]);

  const goNext = useCallback(() => {
    const polygon = toPolygon(points);
    if (polygon && edit) {
      // Volta ao formulário de edição já aberto, com o novo local.
      done.current = true;
      navigation.navigate('EditSpot', {
        id: edit.id,
        coordinates: polygon,
      });
    } else if (polygon) {
      // O passo 1 fica na pilha: "Alterar" no passo 2 volta sem perder os pontos.
      navigation.navigate('NewSpotDetails', { coordinates: polygon });
    }
  }, [edit, navigation, points]);

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
