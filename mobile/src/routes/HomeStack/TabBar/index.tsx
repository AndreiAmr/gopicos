import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';
import { tabInfoMapper } from './helpers';
import { CustomTabBar } from './RoundedButton';

type TabBarProps = BottomTabBarProps & {};
const TAB_BAR_BASE_HEIGHT = 126;

export const TabBar = ({ state, navigation }: TabBarProps) => {
  const themes = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const centerIndex = Math.floor(state.routes.length / 2);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTabBarWidth(event.nativeEvent.layout.width);
  }, []);

  const onPress = useCallback(
    (routeName: string) => {
      navigation.navigate(routeName as never);
    },
    [navigation],
  );

  const tabBarHeight = TAB_BAR_BASE_HEIGHT;

  return (
    <View style={[styles.root, { height: tabBarHeight }]} onLayout={onLayout}>
      <CustomTabBar
        width={tabBarWidth}
        height={tabBarHeight}
        centerLabel={
          tabInfoMapper.get(state.routes[centerIndex]?.name || '')?.label ||
          'Novo pico'
        }
        isCenterFocused={state.index === centerIndex}
        onCenterPress={() => onPress(state.routes[centerIndex]?.name || '')}
      />

      <View style={[styles.tabsRow, { paddingBottom: Math.max(bottom, 12) }]}>
        {state.routes.map((route, index) => {
          if (index === centerIndex) {
            return <View key={route.key} style={styles.centerSpacer} />;
          }

          const currentTab = tabInfoMapper.get(route.name);
          const isCurrentTab = state.index === index;
          const Icon = currentTab?.Icon;

          return (
            <Pressable
              key={route.key}
              onPress={() => onPress(route.name)}
              style={styles.tabButton}
            >
              {Icon && (
                <Icon
                  size={19}
                  color={
                    isCurrentTab ? themes.orange10.val : themes.colorHover.val
                  }
                />
              )}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isCurrentTab
                      ? themes.orange10.val
                      : themes.colorHover.val,
                  },
                ]}
              >
                {currentTab?.label || route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 56,
    gap: 6,
    marginTop: 30,
  },
  centerSpacer: {
    flex: 1,
    minHeight: 56,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
