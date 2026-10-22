import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertBanner, Button, PasswordInput, Text } from '../../../../atomic/ds';
import { size, space } from '../../../../config/tamagui/tokens';
import { profileStrings } from '../logic';
import { passwordStrings } from './logic';
import { useChangePassword } from './useChangePassword';

export const ChangePasswordTemplate = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const s = useChangePassword();

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
            disabled={s.loading}
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
            {passwordStrings.title}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: space[4], gap: space[4] }}
        >
          <Text variant="body" tone="muted">
            {passwordStrings.intro}
          </Text>

          <Controller
            control={s.control}
            name="currentPassword"
            render={({ field }) => (
              <PasswordInput
                ref={field.ref}
                label={passwordStrings.currentLabel}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={s.errors.currentPassword?.message}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="next"
                onSubmitEditing={() => s.focusField('newPassword')}
                disabled={s.loading}
                testID="password-current"
              />
            )}
          />
          <Controller
            control={s.control}
            name="newPassword"
            render={({ field }) => (
              <PasswordInput
                ref={field.ref}
                label={passwordStrings.newLabel}
                hint={passwordStrings.newHint}
                value={field.value}
                onChangeText={value => {
                  field.onChange(value);
                  s.revalidateConfirmation();
                }}
                onBlur={field.onBlur}
                error={s.errors.newPassword?.message}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => s.focusField('confirmPassword')}
                disabled={s.loading}
                testID="password-new"
              />
            )}
          />
          <Controller
            control={s.control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordInput
                ref={field.ref}
                label={passwordStrings.confirmLabel}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={s.errors.confirmPassword?.message}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                onSubmitEditing={s.handleSubmit}
                disabled={s.loading}
                testID="password-confirm"
              />
            )}
          />

          {s.banner ? (
            <AlertBanner
              type="error"
              message={s.banner}
              actionLabel={profileStrings.retry}
              onActionPress={s.handleSubmit}
              testID="password-banner"
            />
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
            label={passwordStrings.submit}
            accessibilityLabel={
              s.loading ? passwordStrings.submitting : passwordStrings.submit
            }
            onPress={s.handleSubmit}
            loading={s.loading}
            fullWidth
            testID="password-submit"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
