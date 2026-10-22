import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileTemplate } from '../../templates/app/profile';
import { EditProfileTemplate } from '../../templates/app/profile/edit';

import { ChangePasswordTemplate } from '../../templates/app/profile/password';

/**
 * Stack da aba Perfil. A TabBar fica visível nas telas de navegação e some nas
 * de formulário (`PROFILE_FORM_SCREENS`, tratado em HomeStack/TabBar).
 */
export const ProfileStack = createNativeStackNavigator({
  initialRouteName: 'ProfileHome',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    ProfileHome: { screen: ProfileTemplate },
    ProfileEdit: { screen: EditProfileTemplate },
    ChangePassword: { screen: ChangePasswordTemplate },
  },
});
