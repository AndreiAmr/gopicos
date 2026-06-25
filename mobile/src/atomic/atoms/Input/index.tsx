import { TextInputProps } from 'react-native';
import { Text } from '../Text';
import * as S from './styles';
import styled from 'styled-components/native';
import { SvgXml } from 'react-native-svg';
import { Icon } from '../../../assets/icons/Icon';

type InputProps = TextInputProps & {
  label: string;
  rightIcon?: keyof typeof Icon;
  onRightIconPress?: () => void;
  error?: string;
  onChange(text: string): void;
};

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0px 10px;
`;

export const TextInput = styled.TextInput.attrs({
  placeholderTextColor: '#000',
})`
  flex: 1;
  height: 40px;
  border-radius: 5px;
  padding: 0px 10px;
  background-color: transparent;
  gap: ${({ theme }) => theme.spacing.inline.xxs}px;
  color: blue;
`;

export const Input = ({
  label,
  value,
  onRightIconPress,
  error,
  onChange,
  ...rest
}: InputProps) => {
  return (
    <S.Container>
      <Text>{label}</Text>
      <InputContainer>
        <TextInput value={value} onChangeText={onChange} {...rest} />
        {rest.rightIcon && (
          <S.RightIconContainer
            onPress={onRightIconPress}
            activeOpacity={onRightIconPress ? 0.4 : 1}
          >
            <SvgXml xml={Icon[rest.rightIcon]} width={24} height={24} />
          </S.RightIconContainer>
        )}
      </InputContainer>
      {error && <Text>{error}</Text>}
    </S.Container>
  );
};
