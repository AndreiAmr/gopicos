import styled, { css } from 'styled-components/native';
import { theme as appTheme } from '@/src/constants/theme';
import { Text as RNText } from 'react-native';

type TextProps = {
  color?: string;
  family?: keyof typeof appTheme.fonts;
  size?: keyof typeof appTheme.fontsize;
  mb?: keyof typeof appTheme.spacing.vertical;
  mt?: keyof typeof appTheme.spacing.vertical;
  textDecorationLine?: 'underline' | 'line-through' | 'none';
  textAlign?: 'left' | 'center' | 'right';
};

export const Text = styled(RNText)<TextProps>`
  ${({
    theme,
    family = 'regular',
    size = 'md',
    color = theme.colors.gray.medium,
    mb,
    mt,
    textDecorationLine = 'none',
    textAlign = 'left',
  }) => css`
    font-family: ${theme.fonts[family]};
    color: ${color};
    font-size: ${theme.fontsize[size]}px;
    margin-bottom: ${mb ? theme.spacing.vertical[mb] : 0}px;
    margin-top: ${mt ? theme.spacing.vertical[mt] : 0}px;
    text-decoration-line: ${textDecorationLine};
    text-align: ${textAlign};
    text-underline-offset: 4px;
    padding-bottom: 3px;
  `}
`;
