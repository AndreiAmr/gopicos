import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginTemplate } from '../templates/auth/login';
import { createStaticNavigation } from '@react-navigation/native';

import { HomeStack } from './HomeStack';

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  // initialRouteName: 'Home',
  screens: {
    Login: {
      screen: LoginTemplate,
    },
    Home: {
      screen: HomeStack,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
