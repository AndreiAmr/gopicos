import { View } from 'tamagui';
import { MAX_FONT_SCALE, radius } from '../../../../config/tamagui/tokens';
import { Text } from '../Text';

export type AvatarSize = 'sm' | 'md' | 'xl';

const dimension: Record<AvatarSize, number> = { sm: 32, md: 48, xl: 96 };
const fontSizes: Record<AvatarSize, number> = { sm: 13, md: 18, xl: 32 };

/** Iniciais: primeira letra do nome + primeira do sobrenome, maiúsculas. */
export const initialsOf = (firstName?: string, lastName?: string): string =>
  [firstName, lastName]
    .map(part => part?.trim().charAt(0).toUpperCase() ?? '')
    .join('');

type AvatarProps = {
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  testID?: string;
};

/**
 * Avatar do MVP (D30): círculo `primary-soft` com as iniciais. Decorativo: o
 * nome já fica ao lado, então não é anunciado.
 */
export const Avatar = ({
  firstName,
  lastName,
  size = 'md',
  testID,
}: AvatarProps) => {
  const box = dimension[size];

  return (
    <View
      width={box}
      height={box}
      borderRadius={radius.full}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$primarySoft"
      borderWidth={size === 'xl' ? 1.5 : 0}
      borderColor="$border"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      testID={testID ?? 'ds-avatar'}
    >
      <Text
        tone="primary"
        fontSize={fontSizes[size]}
        lineHeight={fontSizes[size] + 4}
        fontWeight="600"
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {initialsOf(firstName, lastName)}
      </Text>
    </View>
  );
};
