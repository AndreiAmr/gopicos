import React from 'react';
import Logo from '../../../assets/images/logo.png';
import { Input } from '../../../atomic/atoms/Input';
import { Text } from '../../../atomic/atoms/Text';
import { ActivityIndicator, Image } from 'react-native';
import * as S from './styles';
import { theme } from '../../../constants/theme';
import { useLogin } from './useLogin';
import { BottomSheetModal } from '../../../atomic/molecules/BottomSheetModal';
import { Controller } from 'react-hook-form';

export const LoginTemplate = () => {
  const {
    control,
    showPassword,
    setShowPassword,
    handleLogin,
    errors,
    loading,
    ref,
    errorContent,
    handleCloseModal,
  } = useLogin();

  return (
    <S.Container>
      <S.LogoContainer>
        <Image source={Logo} />
        <Text family="bold">GoPicos</Text>
      </S.LogoContainer>
      <Text family="regular" mt="md" mb="md">
        Informe seus dados de acessos
      </Text>

      <S.InputsContainer>
        <Controller
          control={control}
          name="email"
          render={({ field }) => {
            console.log('🚀 ~ LoginTemplate ~ field:', field);
            return (
              <Input
                label="Email"
                placeholder="Digite aqui"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                {...field}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              {...field}
              label="Senha"
              secureTextEntry={!showPassword}
              placeholder="Digite aqui"
              rightIcon={showPassword ? 'eyeSlash' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
            />
          )}
        />
      </S.InputsContainer>
      <Text textDecorationLine="underline" mb="lg">
        Esqueci minha senha
      </Text>
      <S.Button onPress={handleLogin}>
        {loading ? <ActivityIndicator /> : <S.ButtonText>Entrar</S.ButtonText>}
      </S.Button>
      <Text
        textDecorationLine="underline"
        mb="lg"
        textAlign="center"
        mt="md"
        color={theme.colors.blue.medium}
      >
        Criar minha conta
      </Text>

      <BottomSheetModal
        ref={ref}
        title={errorContent?.title ?? ''}
        description={errorContent?.message ?? ''}
        onClose={handleCloseModal}
      />
    </S.Container>
  );
};
