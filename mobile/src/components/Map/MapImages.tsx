import { Image as MapImage, Images } from '@rnmapbox/maps';
import Svg, { Circle, Rect, TSpan, Text as SvgText } from 'react-native-svg';
import { View, useTheme } from 'tamagui';
import { fontFamily, sticker } from '../../config/tamagui/tokens';

/** Tamanhos do cluster (raio) por faixa de contagem (picos-fechamento 11). */
export const CLUSTER_SIZES = { s: 18, m: 22, l: 26 } as const;
/** Nome ASCII da imagem do pin pelo índice do rótulo (o SDK não aceita "★" no nome). */
export const pinImageName = (index: number) => `pin-${index}`;

/** Expressão do `iconImage`: rótulo do pico -> imagem desenhada para ele. */
export const pinImageExpression = (labels: string[]) =>
  labels.length === 0
    ? ''
    : ([
        'match',
        ['get', 'label'],
        ...labels.flatMap((label, index) => [label, pinImageName(index)]),
        pinImageName(0),
      ] as const);

/**
 * Pílula sticker do pin (spec home.md 6.6): `surface`, borda `ink`
 * (`sticker-outline` no escuro), sombra rígida 2 px e "★ 4,6" ou "Novo".
 */
const PinImage = ({ label }: { label: string }) => {
  const theme = useTheme();
  const rated = label.startsWith('★');
  // A imagem precisa de tamanho explícito para virar bitmap (mesma conta do protótipo).
  const width = Math.round(label.length * 7) + 22;
  const height = 26;
  const offset = sticker.shadowOffsetSm;
  return (
    <View collapsable={false} width={width + offset + 2} height={height + offset + 2}>
      <Svg width={width + offset + 2} height={height + offset + 2}>
        <Rect
          x={1 + offset}
          y={1 + offset}
          width={width}
          height={height}
          rx={height / 2}
          fill={theme.stickerShadow.val}
        />
        <Rect
          x={1}
          y={1}
          width={width}
          height={height}
          rx={height / 2}
          fill={theme.surface.val}
          stroke={theme.stickerOutline.val}
          strokeWidth={1.5}
        />
        <SvgText
          x={1 + width / 2}
          y={1 + height / 2 + 4.5}
          textAnchor="middle"
          fontFamily={fontFamily.bold}
          fontSize={12}
          fill={theme.text.val}
        >
          {rated ? <TSpan fill={theme.star.val}>★</TSpan> : null}
          {rated ? label.slice(1) : label}
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

/** Imagens do estilo (pins e clusters) desenhadas a partir de views do DS. */
export const MapImages = ({ labels }: { labels: string[] }) => (
  <Images>
    {[
      ...labels.map((label, index) => (
        <MapImage key={`pin-${label}`} name={pinImageName(index)}>
          <PinImage label={label} />
        </MapImage>
      )),
      ...(Object.keys(CLUSTER_SIZES) as Array<keyof typeof CLUSTER_SIZES>).map(key => (
        <MapImage key={`cluster-${key}`} name={`cluster-${key}`}>
          <ClusterImage radius={CLUSTER_SIZES[key]} />
        </MapImage>
      )),
    ]}
  </Images>
);
