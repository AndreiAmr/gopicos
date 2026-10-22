import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TAB_CURVE_TOP_Y = 28;
const BUTTON_SIZE = 44;
const PLUS_HORIZONTAL_WIDTH = 16;
const PLUS_VERTICAL_HEIGHT = 16;
const PLUS_THICKNESS = 3;

type CustomTabBarProps = {
  width: number;
  height: number;
  centerLabel: string;
  isCenterFocused: boolean;
  onCenterPress: () => void;
};

const buildRoundedPath = (width: number, height: number) => {
  const centerX = width / 2;
  const leftCurveStart = centerX - 82;
  const rightCurveEnd = centerX + 82;

  return `
    M 0 ${TAB_CURVE_TOP_Y}
    L ${leftCurveStart} ${TAB_CURVE_TOP_Y}

    C ${centerX - 32} ${TAB_CURVE_TOP_Y},
      ${centerX - 32} 0,
      ${centerX} 0

    C ${centerX + 32} 0,
      ${centerX + 32} ${TAB_CURVE_TOP_Y},
      ${rightCurveEnd} ${TAB_CURVE_TOP_Y}

    L ${width} ${TAB_CURVE_TOP_Y}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;
};

export function CustomTabBar({
  width,
  height,
  centerLabel,
  isCenterFocused,
  onCenterPress,
}: CustomTabBarProps) {
  if (!width || !height) return null;

  return (
    <View style={[styles.container, { height }]} pointerEvents="box-none">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={styles.background}
      >
        <Path fill="white" d={buildRoundedPath(width, height)} />
      </Svg>

      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        onPress={onCenterPress}
        style={styles.centerButton}
      >
        <View style={styles.plus}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      </TouchableOpacity>

      <Text
        style={[
          styles.centerLabel,
          isCenterFocused && styles.centerLabelFocused,
        ]}
      >
        {centerLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  centerButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FE7B21',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  plus: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusHorizontal: {
    position: 'absolute',
    width: PLUS_HORIZONTAL_WIDTH,
    height: PLUS_THICKNESS,
    borderRadius: PLUS_THICKNESS / 2,
    backgroundColor: 'white',
  },

  plusVertical: {
    position: 'absolute',
    width: PLUS_THICKNESS,
    height: PLUS_VERTICAL_HEIGHT,
    borderRadius: PLUS_THICKNESS / 2,
    backgroundColor: 'white',
  },

  centerLabel: {
    position: 'absolute',
    alignSelf: 'center',
    top: 70,
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
  },

  centerLabelFocused: {
    color: '#101828',
  },
});
