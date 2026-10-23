import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../../../hooks/query/profile/useProfile';
import { useUpdateProfileMutation } from '../../../../hooks/mutation/updateProfile/useUpdateProfileMutation';
import { resetToLogin } from '../../../../routes/navigationRef';
import { useToast } from '../../../../atomic/ds';
import {
  EditProfileFormData,
  editProfileSchema,
  hasProfileChanges,
  mapProfileError,
  profileStrings,
} from '../logic';

export const useEditProfile = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const { profile, loading: loadingProfile } = useProfile();
  const { mutate, loading: saving } = useUpdateProfileMutation();

  const savedRef = useRef(false);
  const [banner, setBanner] = useState<string | null>(null);

  const savedFirstName = profile?.firstName;
  const savedLastName = profile?.lastName;

  const form = useForm<EditProfileFormData>({
    defaultValues: { firstName: '', lastName: '' },
    // Preenche (e re-sincroniza) com o perfil salvo vindo do cache.
    values:
      savedFirstName !== undefined && savedLastName !== undefined
        ? { firstName: savedFirstName, lastName: savedLastName }
        : undefined,
    resolver: yupResolver(editProfileSchema),
    // Valida ao sair do campo; depois do primeiro erro, a cada digitação.
    mode: 'onTouched',
  });

  const values = form.watch();
  const dirty = profile ? hasProfileChanges(profile, values) : false;

  // Sair com alterações não salvas pede confirmação (voltar, gesto, aba).
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!dirty || savedRef.current || saving) return;

      event.preventDefault();
      Alert.alert(profileStrings.discardTitle, profileStrings.discardMessage, [
        { text: profileStrings.keepEditing, style: 'cancel' },
        {
          text: profileStrings.discard,
          style: 'destructive',
          onPress: () => navigation.dispatch(event.data.action),
        },
      ]);
    });

    return unsubscribe;
  }, [navigation, dirty, saving]);

  const onValid = useCallback(
    async ({ firstName, lastName }: EditProfileFormData) => {
      setBanner(null);
      AccessibilityInfo.announceForAccessibility(profileStrings.saving);

      try {
        await mutate({
          variables: {
            props: { firstName: firstName.trim(), lastName: lastName.trim() },
          },
        });
      } catch (error) {
        const action = mapProfileError(error);

        if (action.kind === 'sessionExpired') {
          resetToLogin({ notice: 'sessionExpired' });
        } else if (action.kind === 'field') {
          form.setError(action.field, { message: action.message });
          form.setFocus(action.field);
        } else {
          setBanner(action.message);
          AccessibilityInfo.announceForAccessibility(action.message);
        }
        return;
      }

      savedRef.current = true;
      toast.show({ type: 'success', message: profileStrings.saved });
      navigation.goBack();
    },
    [mutate, form, toast, navigation],
  );

  const handleSave = form.handleSubmit(onValid);

  return {
    control: form.control,
    errors: form.formState.errors,
    email: profile?.email ?? '',
    loadingProfile,
    ready: Boolean(profile),
    canSave: dirty && !saving,
    saving,
    banner,
    handleSave,
    goBack: navigation.goBack,
    focusLastName: () => form.setFocus('lastName'),
  };
};
