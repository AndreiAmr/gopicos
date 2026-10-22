import { ComponentProps, useState } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from 'tamagui';
import { size } from '../../../config/tamagui/tokens';
import { Input } from '../atoms/Input';

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  'secureTextEntry' | 'right'
>;

/** `Input` com botão (alvo 48x48) que alterna mostrar/ocultar. Começa oculta. */
export const PasswordInput = (props: PasswordInputProps) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <Input
      {...props}
      secureTextEntry={!visible}
      right={
        <Pressable
          onPress={() => setVisible(current => !current)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          accessibilityState={{ checked: visible }}
          style={{
            width: size.touch,
            height: size.touch,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          testID="ds-password-toggle"
        >
          <Icon size={20} color={theme.textMuted.val} />
        </Pressable>
      }
    />
  );
};
