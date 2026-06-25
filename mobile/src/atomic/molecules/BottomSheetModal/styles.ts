import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  ${({ theme }) => css`
    padding: ${theme.spacing.vertical.lg}px ${theme.spacing.inline.xxl}px;
  `}
`;
