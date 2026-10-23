import { useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSpotDetailsQuery } from '../../../hooks/query/spotDetails/useSpotDetailsQuery';
import { clearSession } from '../../../services/session';
import { useToast } from '../../../atomic/ds';
import type { RootStackParamList } from '../../../routes/types';

import { spotDetailsStrings } from './strings';

export { spotDetailsStrings };

export const useSpotDetails = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'SpotDetails'>>();
  const toast = useToast();
  const { spot, status, refetch } = useSpotDetailsQuery(params.id);

  useEffect(() => {
    if (status === 'unauthenticated') {
      clearSession()
        .catch(() => undefined)
        .finally(() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
          }),
        );
    }
  }, [status, navigation]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }, [navigation]);

  // Editar (#45) e Excluir (#48) entram nas próximas issues.
  const notYet = useCallback(
    () => toast.show({ type: 'info', message: spotDetailsStrings.comingSoon }),
    [toast],
  );

  return {
    spot,
    status,
    retry: refetch,
    goBack,
    onEdit: notYet,
    onDelete: notYet,
  };
};
