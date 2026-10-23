import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import {
  TAB_BAR_HEIGHT,
  fontFamily,
  radius,
  sticker,
  stickerShadow,
  zIndex,
} from '../../../config/tamagui/tokens';
import { Text } from '../../../atomic/ds/atoms/Text';
import { SprayStroke } from '../../../atomic/ds/brand';
import { Route } from '../../routeTypes';
import { shouldHideTabBar, tabInfoMapper } from './helpers';

/** Altura real da tab bar (conteúdo 64 + safe area de baixo). */
export const useTabBarHeight = (): number => {
  const { bottom } = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + bottom;
};

/** Esconde a barra com o teclado aberto (`tabBarHideOnKeyboard`, spec home.md 7). */
const useKeyboardVisible = (enabled: boolean): boolean => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled]);
  return enabled && visible;
};

/** Sticker do "Novo pico" (UX-H4): dentro da barra, giro -3, sombra rígida. */
const NewSpotSticker = ({ pressed }: { pressed: boolean }) => {
  const theme = useTheme();
  const shift = pressed ? 2 : 0;
  return (
    <View
      width={40}
      height={34}
      borderRadius={4}
      backgroundColor="$primary"
      borderWidth={sticker.borderWidth}
      borderColor="$ink"
      alignItems="center"
      justifyContent="center"
      boxShadow={stickerShadow(theme.stickerShadow.val, pressed ? 1 : sticker.shadowOffset)}
      transform={[
        { rotate: '-3deg' },
        { translateX: shift },
        { translateY: shift },
        { scale: pressed ? 0.96 : 1 },
      ]}
      marginBottom={3}
    >
      <Plus size={22} color={theme.onPrimary.val} strokeWidth={2.6} />
    </View>
  );
};

/**
 * Tab bar ancorada (spec home.md seção 5, UX-H3): Mapa, Novo pico e Perfil.
 * "Novo pico" é aba de ação (o listener da rota abre o fluxo de criar).
 */
export const TabBar = ({ state, navigation, descriptors }: BottomTabBarProps) => {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { dismissAll } = useBottomSheetModal();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const focusedRoute = state.routes[state.index];
  const hideOnKeyboard = Boolean(
    descriptors[focusedRoute.key]?.options.tabBarHideOnKeyboard,
  );
  const keyboardVisible = useKeyboardVisible(hideOnKeyboard);

  if (shouldHideTabBar(getFocusedRouteNameFromRoute(focusedRoute)) || keyboardVisible) {
    return null;
  }

  return (
    <View
      height={TAB_BAR_HEIGHT + bottom}
      paddingBottom={bottom}
      backgroundColor="$surface"
      borderTopWidth={sticker.borderWidth}
      borderTopColor="$stickerOutline"
      zIndex={zIndex.tabBar}
      flexDirection="row"
      accessibilityRole="tablist"
      testID="tab-bar"
    >
      {state.routes.map((route, index) => {
        const info = tabInfoMapper.get(route.name);
        const isFocused = state.index === index;
        const isAction = route.name === Route.NewSpot;

        const onPress = () => {
          // Um sheet modal aberto fecha antes de navegar (UX-H12).
          dismissAll();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const Icon = info?.Icon;

        return (
          <View
            key={route.key}
            flex={1}
            height={TAB_BAR_HEIGHT}
            alignItems="center"
            justifyContent="center"
            gap={2}
            onPress={onPress}
            onPressIn={() => setPressedKey(route.key)}
            onPressOut={() => setPressedKey(null)}
            accessible
            accessibilityRole={isAction ? 'button' : 'tab'}
            accessibilityState={isAction ? undefined : { selected: isFocused }}
            accessibilityLabel={info?.a11yLabel ?? info?.label}
            testID={`tab-${route.name}`}
          >
            {isAction ? (
              <NewSpotSticker pressed={pressedKey === route.key} />
            ) : Icon ? (
              <Icon
                size={24}
                color={isFocused ? theme.text.val : theme.textMuted.val}
                fill={isFocused ? theme.primarySoft.val : 'transparent'}
              />
            ) : null}
            <Text
              fontFamily={isFocused ? fontFamily.bold : fontFamily.semiBold}
              fontSize={12}
              lineHeight={14}
              textAlign="center"
              numberOfLines={2}
              color={isFocused ? '$text' : '$textMuted'}
            >
              {info?.label}
            </Text>
            {isFocused && !isAction ? (
              <View marginTop={-1} borderRadius={radius.full}>
                <SprayStroke width={24} height={6} />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};
