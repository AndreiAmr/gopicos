import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginTemplate } from '../templates/auth/login';
import { SignupTemplate } from '../templates/auth/signup';
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
    Signup: {
      screen: SignupTemplate,
    },
    Home: {
      screen: HomeStack,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
