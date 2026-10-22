import { AlertCircle, Star } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { size, space } from '../../../../config/tamagui/tokens';
import { dsStrings } from '../../strings';
import { Skeleton } from '../Skeleton';
import { Text } from '../Text';
import {
  MAX_STARS,
  StarFill,
  clampRating,
  formatAverage,
  getStarFills,
  starLabel,
  stepRating,
} from './logic';

type StarRatingProps = {
  /** Nota atual (1-5) no modo entrada, ou média (0-5) no modo leitura. */
  value: number;
  /** Quantidade de avaliações; exibida ao lado da média no modo leitura. */
  count?: number;
  /** Se informado, o componente vira entrada (5 estrelas de 32 px, alvo 48). */
  onChange?: (value: number) => void;
  disabled?: boolean;
  /** Substitui as estrelas por skeleton. */
  loading?: boolean;
  /** Mensagem de erro abaixo da entrada (ex.: "Escolha uma nota"). */
  error?: string;
  testID?: string;
};

type StarIconProps = {
  fill: StarFill;
  iconSize: number;
};

const StarIcon = ({ fill, iconSize }: StarIconProps) => {
  const theme = useTheme();
  const empty = (
    <Star size={iconSize} color={theme.border.val} fill="transparent" />
  );

  if (fill === 'empty') {
    return empty;
  }

  const filled = (
    <Star size={iconSize} color={theme.star.val} fill={theme.star.val} />
  );

  if (fill === 'full') {
    return filled;
  }

  // Meia estrela: contorno vazio por baixo e metade esquerda preenchida por cima.
  return (
    <View width={iconSize} height={iconSize}>
      {empty}
      <View
        position="absolute"
        width={iconSize / 2}
        height={iconSize}
        overflow="hidden"
      >
        {filled}
      </View>
    </View>
  );
};

/**
 * Nota por estrelas. Leitura: estrelas de 16 px + "4,3 (12)". Entrada
 * (`onChange`): radiogroup acessível "Nota de 1 a 5 estrelas" com alvos de 48 px.
 * A nota nunca depende só da cor: contorno vs. preenchimento, número e rótulo.
 */
export const StarRating = ({
  value,
  count,
  onChange,
  disabled = false,
  loading = false,
  error,
  testID,
}: StarRatingProps) => {
  const theme = useTheme();
  const isInput = Boolean(onChange);
  const rating = clampRating(value);

  if (loading) {
    return (
      <Skeleton
        width={isInput ? size.touch * MAX_STARS : 96}
        height={isInput ? size.touch : 16}
        testID={testID ?? 'ds-star-rating'}
      />
    );
  }

  if (!isInput) {
    const text = formatAverage(rating, count ?? 0, dsStrings.starRatingNone);
    return (
      <View
        flexDirection="row"
        alignItems="center"
        gap={space[2]}
        accessible
        accessibilityLabel={`${starLabel(rating)}${
          count ? `, ${count} avaliações` : ''
        }`}
        testID={testID ?? 'ds-star-rating'}
      >
        <View flexDirection="row" gap={space[1] / 2}>
          {getStarFills(rating).map((fill, index) => (
            <StarIcon key={index} fill={fill} iconSize={16} />
          ))}
        </View>
        {text ? (
          <Text variant="caption" tone="muted">
            {text}
          </Text>
        ) : null}
      </View>
    );
  }

  const selected = Math.round(rating);

  return (
    <View gap={space[1]} opacity={disabled ? 0.4 : 1}>
      <View
        flexDirection="row"
        accessibilityRole="radiogroup"
        accessibilityLabel={dsStrings.starRatingGroup}
        accessibilityValue={{
          min: 1,
          max: MAX_STARS,
          now: selected || undefined,
        }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={event => {
          if (disabled) {
            return;
          }
          const direction =
            event.nativeEvent.actionName === 'increment' ? 1 : -1;
          onChange?.(stepRating(selected, direction));
        }}
        testID={testID ?? 'ds-star-rating'}
      >
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const position = index + 1;
          const checked = position === selected;

          return (
            <View
              key={position}
              width={size.touch}
              height={size.touch}
              alignItems="center"
              justifyContent="center"
              onPress={disabled ? undefined : () => onChange?.(position)}
              accessible
              accessibilityRole="radio"
              accessibilityLabel={starLabel(position)}
              accessibilityState={{ checked, disabled }}
              testID={`ds-star-${position}`}
            >
              <StarIcon
                fill={position <= selected ? 'full' : 'empty'}
                iconSize={32}
              />
            </View>
          );
        })}
      </View>
      {error ? (
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[1]}
          accessibilityRole="alert"
        >
          <AlertCircle size={16} color={theme.error.val} />
          <Text variant="bodySm" tone="error" flex={1}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export * from './logic';
