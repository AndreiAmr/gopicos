import styled, { css } from 'styled-components/native';

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
