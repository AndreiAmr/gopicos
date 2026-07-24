import { HomeTemplate } from '../../templates/app/home';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { TabBar } from './TabBar';
import { HomeIcon } from 'lucide-react-native';

export const HomeStack = createBottomTabNavigator({
  tabBar: props => <TabBar {...props} />,
  screenOptions: {
    headerShown: false,
  },

  screens: {
    Home: createBottomTabScreen({
      screen: HomeTemplate,
      options: {
        tabBarIcon: () => <HomeIcon />,
      },
    }),
    NewSpot: createBottomTabScreen({
      screen: HomeTemplate,
      options: {
        tabBarIcon: () => <HomeIcon />,
      },
    }),
    Profile: createBottomTabScreen({
      screen: HomeTemplate,
      options: {
        tabBarIcon: () => <HomeIcon />,
      },
    }),
  },
});
