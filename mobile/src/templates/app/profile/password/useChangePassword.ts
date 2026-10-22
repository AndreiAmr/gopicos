import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useChangePasswordMutation } from '../../../../hooks/mutation/changePassword/useChangePasswordMutation';
import { resetToLogin } from '../../../../routes/navigationRef';
import { useToast } from '../../../../atomic/ds';
import {
  ChangePasswordFormData,
  changePasswordSchema,
  mapChangePasswordError,
  passwordStrings,
} from './logic';

export const useChangePassword = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const { mutate, loading } = useChangePasswordMutation();
  const [banner, setBanner] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    resolver: yupResolver(changePasswordSchema),
    // Valida ao sair do campo; depois do primeiro erro, a cada digitação.
    mode: 'onTouched',
  });

  const onValid = useCallback(
    async ({ currentPassword, newPassword }: ChangePasswordFormData) => {
      setBanner(null);
      AccessibilityInfo.announceForAccessibility(
        passwordStrings.announceSubmitting,
      );

      try {
        await mutate({ variables: { props: { currentPassword, newPassword } } });
      } catch (error) {
        const action = mapChangePasswordError(error);

        if (action.kind === 'sessionExpired') {
          resetToLogin({ notice: 'sessionExpired' });
        } else if (action.kind === 'field') {
          form.setError(action.field, { message: action.message });
          form.setFocus(action.field, { shouldSelect: true });
        } else {
          setBanner(action.message);
          AccessibilityInfo.announceForAccessibility(action.message);
        }
        return;
      }

      // A sessão atual continua válida (D33).
      toast.show({ type: 'success', message: passwordStrings.success });
      navigation.goBack();
    },
    [mutate, form, toast, navigation],
  );

  // A nova senha mudou: a confirmação precisa ser revalidada se já foi tocada.
  const revalidateConfirmation = useCallback(() => {
    if (form.getFieldState('confirmPassword').isTouched) {
      form.trigger('confirmPassword');
    }
  }, [form]);

  return {
    control: form.control,
    errors: form.formState.errors,
    loading,
    banner,
    handleSubmit: form.handleSubmit(onValid),
    goBack: navigation.goBack,
    focusField: form.setFocus,
    revalidateConfirmation,
  };
};
