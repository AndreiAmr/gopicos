import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertBanner, Button, Input, Skeleton, Text } from '../../../../atomic/ds';
import { size, space } from '../../../../config/tamagui/tokens';
import { profileStrings } from '../logic';
import { useEditProfile } from './useEditProfile';

export const EditProfileTemplate = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const s = useEditProfile();

  return (
    <View flex={1} backgroundColor="$bg">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          flexDirection="row"
          alignItems="center"
          gap={space[2]}
          paddingHorizontal={space[4]}
          paddingTop={insets.top + space[2]}
          paddingBottom={space[2]}
        >
          <Pressable
            onPress={s.goBack}
            disabled={s.saving}
            accessibilityRole="button"
            accessibilityLabel={profileStrings.back}
            hitSlop={8}
            style={{
              width: size.touch,
              height: size.touch,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={24} color={theme.text.val} />
          </Pressable>
          <Text variant="h2" accessibilityRole="header">
            {profileStrings.editTitle}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: space[4],
            gap: space[4],
          }}
        >
          {s.loadingProfile && !s.ready ? (
            <View gap={space[4]} testID="edit-profile-skeleton">
              <Skeleton height={48} />
              <Skeleton height={48} />
              <Skeleton height={48} />
            </View>
          ) : null}

          {s.ready ? (
            <>
              <Controller
                control={s.control}
                name="firstName"
                render={({ field }) => (
                  <Input
                    ref={field.ref}
                    label={profileStrings.firstName}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={s.errors.firstName?.message}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    textContentType="givenName"
                    maxLength={40}
                    returnKeyType="next"
                    onSubmitEditing={() => s.focusLastName()}
                    disabled={s.saving}
                    testID="edit-firstName"
                  />
                )}
              />
              <Controller
                control={s.control}
                name="lastName"
                render={({ field }) => (
                  <Input
                    ref={field.ref}
                    label={profileStrings.lastName}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={s.errors.lastName?.message}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    textContentType="familyName"
                    maxLength={40}
                    returnKeyType="go"
                    onSubmitEditing={s.canSave ? s.handleSave : undefined}
                    disabled={s.saving}
                    testID="edit-lastName"
                  />
                )}
              />
              <Input
                label={profileStrings.email}
                value={s.email}
                hint={profileStrings.emailHint}
                disabled
                right={<Lock size={18} color={theme.textMuted.val} />}
                testID="edit-email"
              />

              {s.banner ? (
                <AlertBanner
                  type="error"
                  message={s.banner}
                  actionLabel={profileStrings.retry}
                  onActionPress={s.handleSave}
                  testID="edit-banner"
                />
              ) : null}
            </>
          ) : null}
        </ScrollView>

        <View
          paddingHorizontal={space[4]}
          paddingTop={space[3]}
          paddingBottom={insets.bottom + space[3]}
          backgroundColor="$bg"
          borderTopWidth={1}
          borderTopColor="$divider"
        >
          <Button
            label={profileStrings.save}
            accessibilityLabel={
              s.saving ? profileStrings.saving : profileStrings.save
            }
            onPress={s.handleSave}
            loading={s.saving}
            disabled={!s.canSave && !s.saving}
            fullWidth
            testID="edit-save"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
