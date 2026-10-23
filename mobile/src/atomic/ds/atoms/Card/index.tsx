import { GetProps, View, styled } from 'tamagui';
import { elevation, radius, space } from '../../../../config/tamagui/tokens';

/**
 * Card do DS: `surface`, raio `lg`, borda `divider` (no escuro a elevação vem
 * de surface + borda). `elevated` adiciona sombra nível 1/2 e `pressable`
 * aplica o estado pressed (escala 0.98 + fundo `sunken`).
 */
export const Card = styled(View, {
  name: 'GPCard',
  backgroundColor: '$surface',
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: '$divider',
  padding: space[4],

  variants: {
    elevated: {
      1: { ...elevation[1] },
      2: { ...elevation[2] },
    },
    pressable: {
      true: {
        pressStyle: { scale: 0.98, backgroundColor: '$sunken' },
      },
    },
    disabled: {
      true: { opacity: 0.4 },
    },
    error: {
      true: { borderColor: '$error', borderWidth: 2 },
    },
  } as const,
});

export type CardProps = GetProps<typeof Card>;
