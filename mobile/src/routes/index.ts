import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginTemplate } from '../templates/auth/login';
import { SignupTemplate } from '../templates/auth/signup';
import { createStaticNavigation } from '@react-navigation/native';

import { HomeStack } from './HomeStack';
import { SpotDetailsTemplate } from '../templates/app/spotDetails';

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
    SpotDetails: {
      screen: SpotDetailsTemplate,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
