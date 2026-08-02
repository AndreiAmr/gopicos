import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MapPin } from 'lucide-react-native';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, useTheme, View } from 'tamagui';
import { tabInfoMapper } from './helpers';

type TabBarProps = BottomTabBarProps & {};

export const TabBar = ({ state, navigation }: TabBarProps) => {
  const themes = useTheme();
  const { bottom } = useSafeAreaInsets();

  const onPress = useCallback(
    (screen: string) => {
      navigation.navigate(screen);
    },
    [navigation],
  );

  return (
    <View
      position="absolute"
      bottom={bottom}
      height={60}
      alignSelf="center"
      width="90%"
      borderColor="black"
      bg={themes.backgroundHover}
      zIndex={999}
      borderRadius="$3"
      boxShadow="0 8px 10px -1px $shadowColor"
      flexDirection="row"
      gap="$2"
      paddingRight={6}
      paddingLeft={6}
    >
      {state.routes.map((route, index) => {
        const currentTab = tabInfoMapper.get(route.name);
        const isCurrentTab = state.index === index;

        return (
          <Button
            flex={1}
            height="100%"
            flexDirection="column"
            onPress={() => onPress(route.name)}
            backgroundColor="transparent"
            pressStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
            }}
          >
            {currentTab?.Icon && (
              <currentTab.Icon
                size={15}
                color={
                  isCurrentTab ? themes.orange10.val : themes.colorHover.val
                }
              />
            )}
            <Text
              fontSize="$2.5"
              color={isCurrentTab ? themes.orange10 : themes.colorHover}
            >
              {currentTab?.label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
};
