import { ReactNode, useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Polygon, Rect } from 'react-native-svg';
import { Check, Disc3 } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  MAX_FONT_SCALE,
  fontFamily,
  radius,
  size,
  space,
  sticker,
  stickerShadow,
} from '../../../config/tamagui/tokens';
import { Text } from '../atoms/Text';

/**
 * Peças da camada de marca (DS 13 e spec home.md): spray, fita, sticker e
 * título em Permanent Marker. Tudo vetor e decorativo (fora do leitor de tela).
 */

const styles = StyleSheet.create({
  tapeShadow: { position: 'absolute', top: 2, left: 1 },
  fill: { flex: 1 },
});

const decorative = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants' as const,
  pointerEvents: 'none' as const,
};

/** Hook simples de "reduzir movimento" do sistema. */
export const useReduceMotion = (): boolean => {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => mounted && setReduce(value))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduce,
    );
    return () => {
      mounted = false;
      sub?.remove();
    };
  }, []);
  return reduce;
};

/** Traço de spray `primary` (asset `brand/spray-stroke.svg`). */
export const SprayStroke = ({
  width = 26,
  height = 6,
}: {
  width?: number;
  height?: number;
}) => {
  const theme = useTheme();
  const color = theme.primary.val;
  return (
    <View {...decorative} testID="ds-spray">
      <Svg width={width} height={height} viewBox="0 0 120 14" preserveAspectRatio="none">
        <Path
          d="M3 9 C 22 3, 42 12, 62 7 S 100 3, 117 8"
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M10 12 C 44 9, 80 13, 112 11"
          stroke={color}
          strokeWidth={2}
          opacity={0.55}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={118} cy={4} r={1.6} fill={color} />
        <Circle cx={2} cy={12} r={1.2} fill={color} />
      </Svg>
    </View>
  );
};

/**
 * Título fixo em Permanent Marker com spray embaixo (D41/D43: só títulos, 24+).
 */
export const BrandTitle = ({
  children,
  fontSize = 28,
  sprayWidth = 96,
  testID,
}: {
  children: string;
  fontSize?: 24 | 28 | 30;
  sprayWidth?: number;
  testID?: string;
}) => (
  <View gap={2} alignSelf="flex-start">
    <Text
      accessibilityRole="header"
      fontFamily={fontFamily.display}
      fontSize={fontSize}
      lineHeight={fontSize + 6}
      fontWeight="400"
      testID={testID}
    >
      {children}
    </Text>
    <SprayStroke width={sprayWidth} height={9} />
  </View>
);

/** Pontas recortadas da fita (mesmo desenho do protótipo, em % da caixa). */
const TAPE_POINTS =
  '0,12 2,0 5,8 8,0 92,0 95,9 98,0 100,14 98.5,50 100,86 97,100 94,91 91,100 9,100 6,92 3,100 0,88 1.5,50';
const LABEL_POINTS =
  '0,15 4,0 8,10 12,0 88,0 92,12 96,0 100,18 98,50 100,85 95,100 91,88 86,100 14,100 9,90 4,100 0,85 2,50';

const TapeBackground = ({ points }: { points: string }) => {
  const theme = useTheme();
  return (
    <View position="absolute" top={0} left={0} right={0} bottom={0} {...decorative}>
      {/* Sombra leve (1 x 2) para descolar a fita do mapa. */}
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={styles.tapeShadow}
      >
        <Polygon points={points} fill={theme.ink.val} opacity={0.28} />
      </Svg>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Polygon points={points} fill={theme.brandYellow.val} />
      </Svg>
    </View>
  );
};

/** Ícone de roda girando (16); parado com "reduzir movimento". */
export const SpinningWheel = ({
  size: iconSize = 16,
  color,
}: {
  size?: number;
  color: string;
}) => {
  const reduceMotion = useReduceMotion();
  const rotation = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(rotation);
      rotation.value = 0;
      return;
    }
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
    );
    return () => cancelAnimation(rotation);
  }, [reduceMotion, rotation]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View style={style} {...decorative}>
      <Disc3 size={iconSize} color={color} />
    </Animated.View>
  );
};

/**
 * Fita de placar (spec home.md 6.1): fita amarela, giro -1,5, Inter 14/600
 * `ink`. Não é botão; anuncia mudanças com `polite`.
 */
export const ScoreTape = ({
  text,
  detail,
  spinning = false,
  accessibilityLabel,
  testID,
}: {
  text: string;
  detail?: string;
  spinning?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}) => {
  const theme = useTheme();
  return (
    <View
      flex={1}
      minWidth={0}
      minHeight={36}
      justifyContent="center"
      rotate="-1.5deg"
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={accessibilityLabel ?? (detail ? `${text}, ${detail}` : text)}
      testID={testID ?? 'score-tape'}
    >
      <TapeBackground points={TAPE_POINTS} />
      <View
        flexDirection="row"
        alignItems="center"
        gap={space[2]}
        paddingHorizontal={space[4]}
        paddingVertical={6}
      >
        {spinning ? <SpinningWheel color={theme.ink.val} /> : null}
        {/* flex 1: com fonte grande a fita quebra em 2 linhas em vez de cortar. */}
        <Text
          flex={1}
          fontFamily={fontFamily.semiBold}
          fontSize={14}
          color="$ink"
          testID="score-tape-text"
        >
          {text}
          {detail ? (
            <Text fontFamily={fontFamily.semiBold} fontSize={14} color="$ink" opacity={0.6}>
              {' · '}
            </Text>
          ) : null}
          {detail ?? ''}
        </Text>
      </View>
    </View>
  );
};

/** Título de seção como fita (UX-H8): Inter 14/700 `ink`, giro -2. */
export const TapeLabel = ({ children }: { children: string }) => (
  <View alignSelf="flex-start" rotate="-2deg">
    <TapeBackground points={LABEL_POINTS} />
    <Text
      accessibilityRole="header"
      fontFamily={fontFamily.bold}
      fontSize={14}
      lineHeight={18}
      color="$ink"
      paddingHorizontal={14}
      paddingVertical={5}
    >
      {children}
    </Text>
  </View>
);

type StickerChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Índice na lista: alterna o giro do adesivo marcado. */
  index?: number;
  accessibilityRole?: 'checkbox' | 'button';
  accessibilityLabel?: string;
  trailing?: ReactNode;
  testID?: string;
};

/**
 * Adesivo de filtro (`FilterChip` v3, UX-H9): desmarcado `surface` + borda
 * `border`; marcado amarelo + borda `ink` + sombra rígida + check + giro.
 */
export const StickerChip = ({
  label,
  selected,
  onPress,
  index = 0,
  accessibilityRole = 'checkbox',
  accessibilityLabel,
  trailing,
  testID,
}: StickerChipProps) => {
  const theme = useTheme();
  return (
    <View
      minHeight={size.touch}
      justifyContent="center"
      onPress={onPress}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={accessibilityRole === 'checkbox' ? { checked: selected } : undefined}
      testID={testID}
    >
      <View
        flexDirection="row"
        alignItems="center"
        gap={6}
        minHeight={size.controlMd - 4}
        paddingHorizontal={14}
        borderRadius={4}
        borderWidth={selected ? sticker.borderWidth : 1.5}
        borderColor={selected ? '$ink' : '$border'}
        backgroundColor={selected ? '$brandYellow' : '$surface'}
        rotate={selected ? (index % 2 === 0 ? '-2deg' : '1.5deg') : '0deg'}
        boxShadow={
          selected
            ? stickerShadow(theme.stickerShadow.val, sticker.shadowOffsetSm)
            : undefined
        }
      >
        {selected ? <Check size={16} color={theme.ink.val} strokeWidth={3} /> : null}
        <Text
          fontFamily={fontFamily.semiBold}
          fontSize={14}
          lineHeight={18}
          color={selected ? '$ink' : '$text'}
        >
          {label}
        </Text>
        {trailing}
      </View>
    </View>
  );
};

type StickerSegmentedProps = {
  label: string;
  options: Array<{ value: string; label: string; icon?: ReactNode }>;
  value: string;
  onChange: (value: string) => void;
  testID?: string;
};

/**
 * `Segmented` sticker (spec 6.9): trilho `sunken` com borda `sticker-outline`;
 * opção escolhida `primary` + borda `ink`.
 */
export const StickerSegmented = ({
  label,
  options,
  value,
  onChange,
  testID,
}: StickerSegmentedProps) => (
  <View
    flexDirection="row"
    minHeight={size.touch}
    padding={2}
    gap={2}
    borderWidth={sticker.borderWidth}
    borderColor="$stickerOutline"
    borderRadius={radius.sm}
    backgroundColor="$sunken"
    accessibilityRole="radiogroup"
    accessibilityLabel={label}
    testID={testID}
  >
    {options.map(option => {
      const selected = option.value === value;
      return (
        <View
          key={option.value}
          flex={1}
          flexDirection="row"
          gap={4}
          alignItems="center"
          justifyContent="center"
          borderRadius={4}
          borderWidth={selected ? sticker.borderWidth : 0}
          borderColor="$ink"
          backgroundColor={selected ? '$primary' : 'transparent'}
          onPress={() => onChange(option.value)}
          accessible
          accessibilityRole="radio"
          accessibilityLabel={option.label}
          accessibilityState={{ checked: selected }}
          testID={testID ? `${testID}-${option.value}` : undefined}
        >
          {option.icon}
          <Text
            fontFamily={fontFamily.semiBold}
            fontSize={14}
            lineHeight={18}
            color={selected ? '$onPrimary' : '$text'}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {option.label}
          </Text>
        </View>
      );
    })}
  </View>
);

type MapControlButtonProps = {
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  active?: boolean;
  busy?: boolean;
  disabled?: boolean;
  /** Selo no canto (camada diferente de Rua, permissão negada). */
  badge?: ReactNode;
  testID?: string;
};

/**
 * Botão de controle do mapa (spec 6.3): 48 x 48, sticker com sombra rígida;
 * pressionado desce 2 px e a sombra vira 1 px.
 */
export const MapControlButton = ({
  icon,
  onPress,
  accessibilityLabel,
  active = false,
  busy = false,
  disabled = false,
  badge,
  testID,
}: MapControlButtonProps) => {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const shift = pressed ? 2 : 0;
  return (
    <View
      width={size.touch}
      height={size.touch}
      borderRadius={radius.sm}
      borderWidth={sticker.borderWidth}
      borderColor="$stickerOutline"
      backgroundColor={active ? '$primarySoft' : '$surface'}
      alignItems="center"
      justifyContent="center"
      boxShadow={stickerShadow(theme.stickerShadow.val, pressed ? 1 : sticker.shadowOffset)}
      transform={[{ translateX: shift }, { translateY: shift }]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={disabled || busy ? undefined : onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy, disabled: disabled || busy }}
      testID={testID}
    >
      {icon}
      {busy ? (
        <View position="absolute" top={3} left={3} right={3} bottom={3} {...decorative}>
          <BusyRing color={theme.primary.val} />
        </View>
      ) : null}
      {badge}
    </View>
  );
};

/** Anel girando em volta do ícone (estado "Buscando"). */
const BusyRing = ({ color }: { color: string }) => {
  const reduceMotion = useReduceMotion();
  const rotation = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
    );
    return () => cancelAnimation(rotation);
  }, [reduceMotion, rotation]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  if (reduceMotion) return null;
  return (
    <Animated.View style={[styles.fill, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 38 38">
        <Path
          d="M19 2.5 A16.5 16.5 0 0 1 35.5 19"
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};

/** Selo pequeno no canto de um controle (12 a 18 px). */
export const ControlBadge = ({
  tone,
  label,
}: {
  tone: 'primary' | 'warning';
  label?: string;
}) => (
  <View
    position="absolute"
    top={tone === 'warning' ? -7 : -6}
    right={tone === 'warning' ? -7 : -6}
    width={tone === 'warning' ? 18 : 14}
    height={tone === 'warning' ? 18 : 14}
    borderRadius={radius.full}
    backgroundColor={tone === 'warning' ? '$warning' : '$primary'}
    borderWidth={2}
    borderColor={tone === 'warning' ? '$surface' : '$ink'}
    alignItems="center"
    justifyContent="center"
    {...decorative}
  >
    {label ? (
      <Text fontFamily={fontFamily.bold} fontSize={11} lineHeight={13} color="$surface">
        {label}
      </Text>
    ) : null}
  </View>
);

/** Ilustração do vazio (cone), 64, decorativa. */
export const ConeIllustration = () => {
  const theme = useTheme();
  return (
    <View {...decorative} testID="ds-cone">
      <Svg width={64} height={64} viewBox="0 0 64 64">
        <Ellipse cx={32} cy={58} rx={24} ry={4} fill={theme.sunken.val} />
        <Rect
          x={10}
          y={50}
          width={44}
          height={8}
          rx={2}
          fill={theme.primary.val}
          stroke={theme.ink.val}
          strokeWidth={2}
        />
        <Path
          d="M24 8 H40 L50 50 H14Z"
          fill={theme.primary.val}
          stroke={theme.ink.val}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path d="M20.5 24 H43.5 L45.5 33 H18.5Z" fill={theme.surface.val} />
        <Path d="M16.8 40 H47.2" stroke={theme.surface.val} strokeWidth={5} />
      </Svg>
    </View>
  );
};

/** Meio-tom no canto superior direito do sheet de filtros (30%). */
export const CornerHalftone = () => {
  const theme = useTheme();
  const dots = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) {
      const r = Math.max(0.4, 1.5 - (row * 0.35 + (12 - col) * 0.1));
      dots.push(
        <Circle key={`${row}-${col}`} cx={3.5 + col * 7} cy={3.5 + row * 7} r={r} fill={theme.primary.val} />,
      );
    }
  }
  return (
    <View position="absolute" top={0} right={0} opacity={0.38} {...decorative}>
      <Svg width={96} height={30}>{dots}</Svg>
    </View>
  );
};
