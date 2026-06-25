import * as S from './styles';

type ButtonProps = {
  label: string;
  onPress?: () => void;
};

export const Button = ({ label, onPress }: ButtonProps) => {
  return (
    <S.Button onPress={onPress}>
      <S.ButtonText>{label}</S.ButtonText>
    </S.Button>
  );
};
