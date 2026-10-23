import { useCallback, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfile } from '../../../hooks/query/profile/useProfile';
import { logout } from '../../../services/session/logout';
import type { ProfileStackParamList } from '../../../routes/types';

export const useProfileHome = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { profile, loading, error, refreshing, refresh } = useProfile();

  const goToEdit = useCallback(
    () => navigation.navigate('ProfileEdit'),
    [navigation],
  );

  const goToPassword = useCallback(
    () => navigation.navigate('ChangePassword'),
    [navigation],
  );

  const goToSpots = useCallback(
    () => navigation.navigate('MySpots'),
    [navigation],
  );

  const goToReviews = useCallback(
    () => navigation.navigate('MyReviews'),
    [navigation],
  );

  const goToDelete = useCallback(
    () => navigation.navigate('DeleteAccount'),
    [navigation],
  );

  // P7: confirmação em bottom sheet antes de sair.
  const logoutSheetRef = useRef<BottomSheetModal>(null);
  const [leaving, setLeaving] = useState(false);

  const confirmLogout = useCallback(() => {
    logoutSheetRef.current?.present();
  }, []);

  const cancelLogout = useCallback(() => {
    logoutSheetRef.current?.dismiss();
  }, []);

  // Apaga o token e o cache e reseta a pilha para o Login (sem voltar).
  const doLogout = useCallback(async () => {
    setLeaving(true);
    logoutSheetRef.current?.dismiss();
    try {
      await logout();
    } catch {
      // A sessão é local: `logout` sempre leva ao Login.
    } finally {
      setLeaving(false);
    }
  }, []);

  return {
    profile,
    loading,
    hasError: Boolean(error),
    refreshing,
    refresh,
    goToEdit,
    goToPassword,
    goToSpots,
    goToReviews,
    goToDelete,
    confirmLogout,
    logoutSheetRef,
    leaving,
    cancelLogout,
    doLogout,
  };
};
