import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfile } from '../../../hooks/query/profile/useProfile';
import { logout } from '../../../services/session/logout';
import type { ProfileStackParamList } from '../../../routes/types';
import { profileStrings } from './logic';

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

  const goToDelete = useCallback(
    () => navigation.navigate('DeleteAccount'),
    [navigation],
  );

  // P7: confirmação antes de sair; o foco inicial fica em "Cancelar".
  const confirmLogout = useCallback(() => {
    Alert.alert(profileStrings.logoutTitle, profileStrings.logoutMessage, [
      { text: profileStrings.cancel, style: 'cancel' },
      {
        text: profileStrings.logout,
        style: 'destructive',
        onPress: () => {
          logout().catch(() => undefined);
        },
      },
    ]);
  }, []);

  return {
    profile,
    loading,
    hasError: Boolean(error),
    refreshing,
    refresh,
    goToEdit,
    goToPassword,
    goToDelete,
    confirmLogout,
  };
};
