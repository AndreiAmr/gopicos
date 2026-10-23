import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { View } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertBanner,
  Button,
  Halftone,
  Input,
  PasswordInput,
  Tape,
  Text,
  TextLink,
  Wordmark,
} from '../../../atomic/ds';
import { space } from '../../../config/tamagui/tokens';
import { loginStrings } from './logic';
import { useLogin } from './useLogin';

const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
};

export const LoginTemplate = () => {
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const {
    control,
    errors,
    handleLogin,
    submitting,
    failure,
    failureMessage,
    passwordRef,
    notice,
    goToSignup,
  } = useLogin();

  return (
    <View flex={1} backgroundColor="$bg">
      {keyboardVisible ? null : (
        <>
          <Tape />
          <Halftone />
        </>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: space[8],
            paddingTop: insets.top + space[6],
            paddingBottom: insets.bottom + space[6],
          }}
        >
          <Text accessibilityRole="header" position="absolute" opacity={0}>
            {loginStrings.title}
          </Text>

          <Wordmark />
          <Text variant="bodySm" tone="muted" marginTop={space[2]}>
            {loginStrings.tagline}
          </Text>

          <View marginTop={space[8]} gap={space[4]}>
            {notice ? (
              <AlertBanner
                type={
                  notice === 'sessionExpired' || notice === 'accountDeleted'
                    ? 'info'
                    : 'success'
                }
                message={loginStrings.notices[notice]}
              />
            ) : null}

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  ref={field.ref}
                  label={loginStrings.emailLabel}
                  placeholder={loginStrings.emailPlaceholder}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.email?.message}
                  loading={false}
                  disabled={submitting}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="username"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  testID="login-email"
                />
              )}
            />

            <View gap={space[2]}>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <PasswordInput
                    ref={passwordRef}
                    label={loginStrings.passwordLabel}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.password?.message}
                    disabled={submitting}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                    testID="login-password"
                  />
                )}
              />
              <View alignItems="flex-end">
                <TextLink
                  quiet
                  label={loginStrings.forgotPassword}
                  disabled={submitting}
                />
              </View>
            </View>

            {failure ? (
              <AlertBanner
                type="error"
                message={failureMessage ?? ''}
                actionLabel={
                  failure === 'credentials' ? undefined : loginStrings.retry
                }
                onActionPress={handleLogin}
                testID="login-failure"
              />
            ) : null}

            <Button
              label={loginStrings.submit}
              accessibilityLabel={
                submitting ? loginStrings.signingIn : loginStrings.submit
              }
              onPress={handleLogin}
              loading={submitting}
              fullWidth
              testID="login-submit"
            />
          </View>

          <View
            marginTop={space[6]}
            paddingTop={space[4]}
            borderTopWidth={1}
            borderTopColor="$divider"
            alignItems="center"
          >
            <Text variant="bodySm" tone="muted">
              {loginStrings.noAccount}
            </Text>
            <TextLink
              label={loginStrings.signUp}
              disabled={submitting}
              onPress={goToSignup}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
