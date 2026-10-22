import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  ${({ theme }) => css`
    padding: ${theme.spacing.vertical.lg}px ${theme.spacing.inline.xxl}px;
  `}
`;

export const LayerList = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const LayerOption = styled.Pressable`
  align-items: center;
`;

export const LayerThumbnail = styled.Image<{ selected: boolean }>`
  ${({ theme, selected }) => css`
    width: 72px;
    height: 72px;
    border-radius: 12px;
    background-color: ${theme.colors.gray.lightest};
    border-width: 2px;
    border-color: ${selected ? theme.colors.blue.medium : 'transparent'};
    margin-bottom: ${theme.spacing.vertical.xs}px;
  `}
`;
