import { HomeTemplate } from '../../templates/app/home';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { TabBar } from './TabBar';
import { ProfileStack } from '../ProfileStack';

/** A aba "Novo pico" não tem tela própria: abre o fluxo de criar (UX-H2). */
const NewSpotAction = () => null;

export const HomeStack = createBottomTabNavigator({
  tabBar: props => <TabBar {...props} />,
  screenOptions: {
    headerShown: false,
    // A busca abre o teclado: a tab bar some para a lista ir até ele (spec 7).
    tabBarHideOnKeyboard: true,
  },

  screens: {
    Home: createBottomTabScreen({
      screen: HomeTemplate,
    }),
    NewSpot: createBottomTabScreen({
      screen: NewSpotAction,
      listeners: ({ navigation }) => ({
        tabPress: event => {
          // Aba de ação: nunca fica selecionada; ao voltar, a aba anterior segue ativa.
          event.preventDefault();
          navigation.getParent()?.navigate('NewSpotLocation');
        },
      }),
    }),
    Profile: createBottomTabScreen({
      screen: ProfileStack,
    }),
  },
});
