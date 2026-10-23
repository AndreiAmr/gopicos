import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  useMyReviews,
  useMySpots,
} from '../../../../hooks/query/myActivity/useMyActivity';

// `SpotDetails` é uma rota da pilha raiz (spec de picos); `navigate` sobe até ela.
const useActivityNavigation = () => {
  const navigation = useNavigation();

  const openSpot = useCallback(
    (id: string) =>
      (navigation.navigate as (route: string, params: unknown) => void)(
        'SpotDetails',
        { id },
      ),
    [navigation],
  );

  const goToMap = useCallback(
    () =>
      (navigation.navigate as (route: string, params: unknown) => void)('Home', {
        screen: 'Home',
      }),
    [navigation],
  );

  const goToNewSpot = useCallback(
    () =>
      (navigation.navigate as (route: string, params: unknown) => void)('Home', {
        screen: 'NewSpot',
      }),
    [navigation],
  );

  return { openSpot, goToMap, goToNewSpot, goBack: navigation.goBack };
};

export const useMySpotsScreen = () => ({
  ...useMySpots(),
  ...useActivityNavigation(),
});

export const useMyReviewsScreen = () => ({
  ...useMyReviews(),
  ...useActivityNavigation(),
});
