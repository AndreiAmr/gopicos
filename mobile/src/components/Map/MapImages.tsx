import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Image as MapImage, Images } from '@rnmapbox/maps';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { View, useTheme } from 'tamagui';
import { fontFamily, sticker } from '../../config/tamagui/tokens';
import { pinLayout } from '../../domain/map/pinLayout';

/** Tamanhos do cluster (raio) por faixa de contagem (picos-fechamento 11). */
export const CLUSTER_SIZES = { s: 18, m: 22, l: 26 } as const;
/** Nome ASCII da imagem do pin pelo índice do rótulo (o SDK não aceita "★" no nome). */
export const pinImageName = (index: number, selected = false) =>
  `${selected ? 'pin-sel' : 'pin'}-${index}`;

/** Expressão do `iconImage`: rótulo do pico -> imagem desenhada para ele. */
export const pinImageExpression = (labels: string[], selected = false) =>
  labels.length === 0
    ? ''
    : ([
        'match',
        ['get', 'label'],
        ...labels.flatMap((label, index) => [label, pinImageName(index, selected)]),
        pinImageName(0, selected),
      ] as const);

/**
 * Pin sticker (spec home.md 6.6): pílula `surface` com borda `sticker-outline`
 * e sombra rígida 2 px; selecionado: 30 de altura, `primary`, borda 2 `ink` e
 * sombra 3 (o giro de -3 vem do `iconRotate`). A estrela e a nota são
 * posicionadas por conta própria para ficar "★ 4,6" centralizado.
 */
const PinImage = ({ label, selected }: { label: string; selected: boolean }) => {
  const theme = useTheme();
  const layout = pinLayout(label, selected);
  const offset = selected ? sticker.shadowOffset : sticker.shadowOffsetSm;
  const box = { width: layout.width + offset + 2, height: layout.height + offset + 2 };
  const textColor = selected ? theme.onPrimary.val : theme.text.val;
  const baseline = 1 + layout.height / 2 + layout.fontSize * 0.36;
  return (
    <View collapsable={false} width={box.width} height={box.height}>
      <Svg width={box.width} height={box.height}>
        <Rect
          x={1 + offset}
          y={1 + offset}
          width={layout.width}
          height={layout.height}
          rx={layout.height / 2}
          fill={theme.stickerShadow.val}
        />
        <Rect
          x={1}
          y={1}
          width={layout.width}
          height={layout.height}
          rx={layout.height / 2}
          fill={selected ? theme.primary.val : theme.surface.val}
          stroke={selected ? theme.ink.val : theme.stickerOutline.val}
          strokeWidth={selected ? 2 : 1.5}
        />
        {layout.star ? (
          <SvgText
            x={1 + layout.star.x}
            y={baseline}
            fontFamily={fontFamily.bold}
            fontSize={layout.fontSize}
            fill={selected ? textColor : theme.star.val}
          >
            ★
          </SvgText>
        ) : null}
        <SvgText
          x={1 + layout.text.x}
          y={baseline}
          fontFamily={fontFamily.bold}
          fontSize={layout.fontSize}
          fill={textColor}
        >
          {layout.text.value}
        </SvgText>
      </Svg>
    </View>
  );
};

/**
 * Círculo do cluster: `primary`, borda 2 `ink`, sombra rígida e contorno
 * externo tracejado (marca de spray). A contagem é desenhada pelo mapa.
 */
const ClusterImage = ({ radius }: { radius: number }) => {
  const theme = useTheme();
  const outer = radius + 6;
  const box = (outer + 2) * 2 + sticker.shadowOffsetSm;
  const c = outer + 2;
  return (
    <View collapsable={false} width={box} height={box}>
      <Svg width={box} height={box}>
        <Circle
          cx={c}
          cy={c}
          r={outer}
          fill="none"
          stroke={theme.stickerOutline.val}
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <Circle cx={c + 2} cy={c + 2} r={radius} fill={theme.stickerShadow.val} />
        <Circle
          cx={c}
          cy={c}
          r={radius}
          fill={theme.primary.val}
          stroke={theme.ink.val}
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

type Refreshable = { refresh: () => void };

export type MapImagesHandle = { refreshAll: () => void };

/**
 * O SDK tira a "foto" de cada view 10 µs depois de montá-la, muitas vezes
 * antes do layout e do desenho do SVG: a imagem fica vazia ou nem é
 * registrada e os pins somem. Por isso refazemos a foto depois que as views
 * estão desenhadas (e de novo quando o estilo termina de carregar).
 *
 * O `Images` só registra no estilo as imagens que já eram filhas dele quando
 * entrou no mapa: uma imagem montada depois nunca aparece (GP-132). Por isso
 * o conjunto de imagens é fixo (todos os rótulos possíveis) e o componente
 * não é remontado; a troca de tema só refaz as fotos (`scheme`).
 */
export const REFRESH_DELAYS_MS = [60, 300, 1000, 2500];

/** Imagens do estilo (pins, pin selecionado e clusters) desenhadas a partir de views. */
type MapImagesProps = {
  labels: string[];
  /** Tema atual: ao mudar, as fotos são refeitas com as novas cores. */
  scheme?: string;
};

export const MapImages = forwardRef<MapImagesHandle, MapImagesProps>(
  ({ labels, scheme }, ref) => {
    const clusterKeys = Object.keys(CLUSTER_SIZES) as Array<keyof typeof CLUSTER_SIZES>;
    const refs = useMemo(
      () =>
        Array.from({ length: labels.length * 2 + clusterKeys.length }, () =>
          createRef<Refreshable>(),
        ),
      [labels.length, clusterKeys.length],
    );

    const refreshAll = useCallback(() => {
      refs.forEach(item => item.current?.refresh());
    }, [refs]);

    useImperativeHandle(ref, () => ({ refreshAll }), [refreshAll]);

    useEffect(() => {
      const timers = REFRESH_DELAYS_MS.map(delay => setTimeout(refreshAll, delay));
      return () => timers.forEach(clearTimeout);
    }, [refreshAll, labels, scheme]);

    let i = 0;
    return (
      <Images>
        {[
          ...labels.map((label, index) => (
            <MapImage key={`pin-${label}`} ref={refs[i++]} name={pinImageName(index)}>
              <PinImage label={label} selected={false} />
            </MapImage>
          )),
          ...labels.map((label, index) => (
            <MapImage
              key={`pin-sel-${label}`}
              ref={refs[i++]}
              name={pinImageName(index, true)}
            >
              <PinImage label={label} selected />
            </MapImage>
          )),
          ...clusterKeys.map(key => (
            <MapImage key={`cluster-${key}`} ref={refs[i++]} name={`cluster-${key}`}>
              <ClusterImage radius={CLUSTER_SIZES[key]} />
            </MapImage>
          )),
        ]}
      </Images>
    );
  },
);

MapImages.displayName = 'MapImages';
