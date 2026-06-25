import { SafeAreaView } from 'react-native-safe-area-context';
import { css, styled } from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  ${({ theme }) => css`
    flex: 1;
    justify-content: center;
    padding: 0 ${theme.spacing.inline.xxl}px;
    margin-bottom: 10px;
    background-color: ${theme.colors.gray.lightest};
  `}
`;

export const LogoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inline.xxs}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const ForgotPassword = styled.Text`
  font-size: 14px;
  text-decoration: underline;
  line-height: 20px;
`;

export const InputsContainer = styled.View`
  ${({ theme }) => css`
    gap: ${theme.spacing.vertical.md}px;
    margin-bottom: ${theme.spacing.vertical.md}px;
  `}
`;

export const Button = styled.TouchableOpacity`
  ${({ theme }) => css`
    background-color: ${theme.colors.blue.medium};
    width: 100%;
    border-radius: 15px;
    padding: 12px;
    justify-content: center;
    align-items: center;
  `}
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;
