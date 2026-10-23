import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../../../hooks/query/profile/useProfile';
import { useDeleteAccountMutation } from '../../../../hooks/mutation/deleteAccount/useDeleteAccountMutation';
import { logout } from '../../../../services/session/logout';
import { resetToLogin } from '../../../../routes/navigationRef';
import {
  DeleteFormData,
  deleteSchema,
  deleteStrings,
  keepsActivityText,
  mapDeleteError,
} from './logic';

export const useDeleteAccount = () => {
  const navigation = useNavigation();
  // A tela nunca espera as contagens: sem elas usa o texto genérico (spec 7.2).
  const { profile } = useProfile();
  const { mutate, loading } = useDeleteAccountMutation();
  const [banner, setBanner] = useState<string | null>(null);

  const form = useForm<DeleteFormData>({
    defaultValues: { password: '' },
    resolver: yupResolver(deleteSchema),
    mode: 'onTouched',
  });

  const onValid = useCallback(
    async ({ password }: DeleteFormData) => {
      setBanner(null);
      AccessibilityInfo.announceForAccessibility(
        deleteStrings.announceSubmitting,
      );

      try {
        await mutate({ variables: { props: { password } } });
      } catch (error) {
        const action = mapDeleteError(error);

        if (action.kind === 'sessionExpired') {
          resetToLogin({ notice: 'sessionExpired' });
        } else if (action.kind === 'field') {
          form.setError('password', { message: action.message });
          form.setFocus('password', { shouldSelect: true });
        } else {
          setBanner(action.message);
          AccessibilityInfo.announceForAccessibility(action.message);
        }
        return;
      }

      // Apaga token e estado e vai ao Login (replace) com o aviso e o e-mail.
      await logout({ notice: 'accountDeleted', email: profile?.email });
    },
    [mutate, form, profile?.email],
  );

  return {
    control: form.control,
    errors: form.formState.errors,
    loading,
    banner,
    keepsActivity: keepsActivityText(
      profile?.spotsCount,
      profile?.reviewsCount,
    ),
    handleDelete: form.handleSubmit(onValid),
    goBack: navigation.goBack,
  };
};
