import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export type NavigationRoute = {
  [RouteName in keyof RootStackParamList]: {
    name: RouteName;
    params: RootStackParamList[RouteName];
  };
}[keyof RootStackParamList];

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigateToRoute = ({ name, params }: NavigationRoute) => {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate(name, params);
};

export const resetToRoute = ({ name, params }: NavigationRoute) => {
  if (!navigationRef.isReady()) return;

  navigationRef.reset({
    index: 0,
    routes: [{ name, params }],
  });
};

export const goBack = () => {
  if (!navigationRef.isReady() || !navigationRef.canGoBack()) return;

  navigationRef.goBack();
};
