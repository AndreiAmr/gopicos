import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginTemplate } from '../templates/auth/login';
import { SignupTemplate } from '../templates/auth/signup';
import { createStaticNavigation } from '@react-navigation/native';

import { HomeStack } from './HomeStack';
import { SpotDetailsTemplate } from '../templates/app/spotDetails';
import { NewSpotLocationTemplate } from '../templates/app/newSpot/location';
import { NewSpotDetailsTemplate } from '../templates/app/newSpot/details';
import { EditSpotTemplate } from '../templates/app/editSpot';
import { EditSpotLocationTemplate } from '../templates/app/editSpot/location';

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
    NewSpotLocation: {
      screen: NewSpotLocationTemplate,
    },
    NewSpotDetails: {
      screen: NewSpotDetailsTemplate,
    },
    EditSpot: {
      screen: EditSpotTemplate,
    },
    EditSpotLocation: {
      screen: EditSpotLocationTemplate,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
