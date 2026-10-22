import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { Button, Input, Text } from '../../../atomic/ds';
import { space } from '../../../config/tamagui/tokens';
import { AlertBanner, Stepper } from './components';
import { TOTAL_STEPS, useSignup } from './useSignup';

const ToggleVisibility = ({
  visible,
  onPress,
}: {
  visible: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const Icon = visible ? EyeOff : Eye;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
      testID="toggle-password"
    >
      <Icon size={20} color={theme.textMuted.val} />
    </Pressable>
  );
};

export const SignupTemplate = () => {
  const s = useSignup();
  const { control, errors, step, loading } = s;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View flex={1} backgroundColor="$bg">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: space[8],
              paddingBottom: space[6],
              gap: space[4],
            }}
          >
            {step > 1 ? (
              <Pressable
                onPress={s.goBack}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                hitSlop={8}
              >
                <Text variant="bodyStrong" tone="primary">
                  ← Voltar
                </Text>
              </Pressable>
            ) : null}

            <Text variant="h1" accessibilityRole="header">
              Criar conta
            </Text>
            <Stepper step={step} total={TOTAL_STEPS} />
            <Text variant="h2" accessibilityRole="header">
              {s.subtitle}
            </Text>

            {step === 1 ? (
              <>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <Input
                      label="Nome"
                      placeholder="Marina"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.firstName?.message}
                      autoCapitalize="words"
                      autoComplete="given-name"
                      textContentType="givenName"
                      maxLength={40}
                      returnKeyType="next"
                      loading={false}
                      disabled={loading}
                      testID="signup-firstName"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <Input
                      label="Sobrenome"
                      placeholder="Souza"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.lastName?.message}
                      autoCapitalize="words"
                      autoComplete="family-name"
                      textContentType="familyName"
                      maxLength={40}
                      returnKeyType="go"
                      onSubmitEditing={s.handleContinue}
                      testID="signup-lastName"
                    />
                  )}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      label="E-mail"
                      placeholder="voce@exemplo.com"
                      value={field.value}
                      onChangeText={value => {
                        field.onChange(value);
                        s.handleOriginalChange('email', 'confirmEmail');
                      }}
                      onBlur={field.onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      spellCheck={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      testID="signup-email"
                    />
                  )}
                />
                {s.emailTaken ? (
                  <Pressable
                    onPress={s.goToLogin}
                    accessibilityRole="link"
                    accessibilityLabel="Entrar"
                    hitSlop={8}
                  >
                    <Text variant="bodyStrong" tone="primary">
                      Entrar
                    </Text>
                  </Pressable>
                ) : null}
                <Controller
                  control={control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <Input
                      label="Confirmar e-mail"
                      placeholder="Repita o e-mail"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.confirmEmail?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      spellCheck={false}
                      autoComplete="off"
                      returnKeyType="go"
                      onSubmitEditing={s.handleContinue}
                      testID="signup-confirmEmail"
                    />
                  )}
                />
              </>
            ) : null}

            {step === 3 ? (
              <>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      label="Senha"
                      hint="Mínimo de 8 caracteres."
                      value={field.value}
                      onChangeText={value => {
                        field.onChange(value);
                        s.handleOriginalChange('password', 'confirmPassword');
                      }}
                      onBlur={field.onBlur}
                      error={errors.password?.message}
                      secureTextEntry={!s.showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      returnKeyType="next"
                      disabled={loading}
                      right={
                        <ToggleVisibility
                          visible={s.showPassword}
                          onPress={s.toggleShowPassword}
                        />
                      }
                      testID="signup-password"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <Input
                      label="Confirmar senha"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.confirmPassword?.message}
                      secureTextEntry={!s.showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      returnKeyType="go"
                      onSubmitEditing={s.handleContinue}
                      disabled={loading}
                      right={
                        <ToggleVisibility
                          visible={s.showConfirmPassword}
                          onPress={s.toggleShowConfirmPassword}
                        />
                      }
                      testID="signup-confirmPassword"
                    />
                  )}
                />
              </>
            ) : null}

            {s.bannerMessage ? (
              <AlertBanner
                message={s.bannerMessage}
                actionLabel="Tentar novamente"
                onAction={s.retry}
              />
            ) : null}

            {step === 1 ? (
              <View flexDirection="row" gap={space[1]} alignItems="center">
                <Text variant="body" tone="muted">
                  Já tem conta?
                </Text>
                <Pressable
                  onPress={s.goToLogin}
                  accessibilityRole="link"
                  hitSlop={8}
                >
                  <Text variant="bodyStrong" tone="primary">
                    Entrar
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </ScrollView>

          <View
            padding={space[4]}
            backgroundColor="$bg"
            borderTopWidth={1}
            borderTopColor="$border"
          >
            <Button
              label={step === TOTAL_STEPS ? 'Criar conta' : 'Continuar'}
              onPress={s.handleContinue}
              loading={loading}
              fullWidth
              testID="signup-continue"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
