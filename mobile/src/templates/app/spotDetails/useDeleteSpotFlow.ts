import { useCallback, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useApolloClient } from '@apollo/client/react';
import { normalizeApolloError } from '../../../config/apollo';
import { useDeleteSpotMutation } from '../../../hooks/mutation/spot/useDeleteSpotMutation';
import { clearSession } from '../../../services/session';
import { useToast } from '../../../atomic/ds';
import type { RootStackParamList } from '../../../routes/types';
import { spotDetailsStrings } from './strings';

/**
 * Exclusão do pico (GP-045): confirmação em sheet, mutation, toast, volta à
 * Home e atualização do mapa e de "meus picos".
 */
export const useDeleteSpotFlow = (spotId: string) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apollo = useApolloClient();
  const toast = useToast();
  const { mutate, loading: deleting } = useDeleteSpotMutation();

  const sheetRef = useRef<BottomSheetModal>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const open = useCallback(() => {
    setError(null);
    sheetRef.current?.present();
  }, []);

  const cancel = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const leave = useCallback(() => {
    sheetRef.current?.dismiss();
    // O pico some do mapa e de "meus picos" sem recarregar o app.
    apollo
      .refetchQueries({ include: ['GetAllSpots', 'MySpots'] })
      .catch(() => undefined);
    navigation.navigate('Home');
  }, [apollo, navigation]);

  const confirm = useCallback(async () => {
    setError(null);
    try {
      await mutate({ variables: { id: spotId } });
      leave();
      toast.show({ type: 'success', message: spotDetailsStrings.deleteDone });
    } catch (caught) {
      const api = normalizeApolloError(caught);

      if (api?.type === 'NOT_FOUND') {
        leave();
        toast.show({
          type: 'info',
          message: spotDetailsStrings.deleteAlreadyGone,
        });
      } else if (api?.type === 'FORBIDDEN') {
        sheetRef.current?.dismiss();
        toast.show({
          type: 'error',
          message: spotDetailsStrings.deleteForbidden,
        });
      } else if (api?.type === 'UNAUTHENTICATED') {
        sheetRef.current?.dismiss();
        clearSession()
          .catch(() => undefined)
          .finally(() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
            }),
          );
      } else {
        setError(spotDetailsStrings.deleteError);
      }
    }
  }, [leave, mutate, navigation, spotId, toast]);

  return { sheetRef, deleting, error, open, cancel, confirm, clearError };
};
