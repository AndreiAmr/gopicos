import { useState } from 'react';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Layers, LocateFixed, LocateOff, Navigation } from 'lucide-react-native';
import { useTheme } from 'tamagui';
import { motion, zIndex } from '../../../../../config/tamagui/tokens';
import {
  ControlBadge,
  MapControlButton,
} from '../../../../../atomic/ds/brand';
import { MapLayer, layersButtonLabel } from '../../../../../domain/map/layers';
import {
  LocationStatus,
  locationA11yLabel,
} from '../../../../../domain/map/location';
import {
  COLUMN_GAP,
  COLUMN_HEIGHT,
  GUTTER,
  columnFits,
  sheetOverlap,
} from '../../layout';

type ControlColumnProps = {
  layer: MapLayer;
  locationStatus: LocationStatus;
  onLayers: () => void;
  onLocation: () => void;
  /** Topos dos sheets não modais (resumo e vazio), no referencial do mapa. */
  sheetTops: SharedValue<number>[];
  mapHeight: SharedValue<number>;
  /** Fim da zona do topo (Z1). */
  z1Bottom: SharedValue<number>;
  /** Teclado ou sheet modal: a coluna some. */
  forceHidden: boolean;
};

/**
 * Coluna Z2 (spec home.md 6.3 e 4.2): Camadas em cima, Localização embaixo.
 * Sobe junto com o sheet em tempo real e some (120 ms) quando não cabe.
 */
export const ControlColumn = ({
  layer,
  locationStatus,
  onLayers,
  onLocation,
  sheetTops,
  mapHeight,
  z1Bottom,
  forceHidden,
}: ControlColumnProps) => {
  const theme = useTheme();
  const [hidden, setHidden] = useState(false);

  const base = useDerivedValue(() => {
    let top = mapHeight.value;
    for (const sheet of sheetTops) {
      top = Math.min(top, sheet.value);
    }
    return top;
  });

  const fits = useDerivedValue(() => columnFits(z1Bottom.value, base.value));

  useAnimatedReaction(
    () => fits.value,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setHidden)(!current);
      }
    },
  );

  const style = useAnimatedStyle(() => ({
    opacity: withTiming(fits.value && !forceHidden ? 1 : 0, {
      duration: motion.fast,
    }),
    transform: [
      { translateY: -sheetOverlap(mapHeight.value, base.value) },
    ],
  }));

  const invisible = hidden || forceHidden;
  const iconColor = theme.text.val;

  return (
    <Animated.View
      pointerEvents={invisible ? 'none' : 'box-none'}
      accessibilityElementsHidden={invisible}
      importantForAccessibility={invisible ? 'no-hide-descendants' : 'auto'}
      style={[
        {
          position: 'absolute',
          right: GUTTER,
          bottom: COLUMN_GAP,
          height: COLUMN_HEIGHT,
          justifyContent: 'space-between',
          zIndex: zIndex.mapControls,
        },
        style,
      ]}
      testID="control-column"
    >
      <MapControlButton
        icon={<Layers size={24} color={iconColor} />}
        onPress={onLayers}
        accessibilityLabel={layersButtonLabel(layer)}
        badge={layer !== 'street' ? <ControlBadge tone="primary" /> : null}
        testID="control-layers"
      />
      <MapControlButton
        icon={
          locationStatus === 'denied' ? (
            <LocateOff size={24} color={iconColor} />
          ) : locationStatus === 'centered' ? (
            <Navigation size={22} color={iconColor} fill={iconColor} />
          ) : (
            <LocateFixed size={24} color={iconColor} />
          )
        }
        active={locationStatus === 'centered'}
        busy={locationStatus === 'searching'}
        onPress={onLocation}
        accessibilityLabel={locationA11yLabel(locationStatus)}
        badge={
          locationStatus === 'denied' ? <ControlBadge tone="warning" label="!" /> : null
        }
        testID="control-location"
      />
    </Animated.View>
  );
};
