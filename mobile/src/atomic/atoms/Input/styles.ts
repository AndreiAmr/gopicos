import { styled } from 'styled-components/native';

export const Container = styled.View``;

export const InputContainer = styled.View``;

export const TextInput = styled.TextInput`
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  padding: 0px 10px;
`;

export const RightIconContainer = styled.TouchableOpacity``;
