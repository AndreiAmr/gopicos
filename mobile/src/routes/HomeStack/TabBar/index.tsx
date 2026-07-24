import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MapPin } from 'lucide-react-native';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, useTheme, View } from 'tamagui';

type TabBarProps = BottomTabBarProps & {};

export const TabBar = ({ state, navigation }: TabBarProps) => {
  console.log('🚀 ~ TabBar ~ state:', state);
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
      {state.routes.map((route, index) => (
        <Button
          flex={1}
          height="100%"
          flexDirection="column"
          onPress={() => onPress(route.name)}
        >
          <MapPin />
          <Text fontSize="$2.5">{route.name}</Text>
        </Button>
      ))}
    </View>
  );
};
