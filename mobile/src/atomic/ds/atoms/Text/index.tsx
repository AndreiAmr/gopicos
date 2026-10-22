import { GetProps, Text as TamaguiText, styled } from 'tamagui';
import { MAX_FONT_SCALE, typography } from '../../../../config/tamagui/tokens';

/**
 * Texto do DS. `variant` aplica a escala tipográfica (tamanho, altura de linha,
 * peso) e `tone` escolhe a cor semântica. Escala de fonte do sistema liberada
 * até 1.3x.
 */
export const Text = styled(TamaguiText, {
  name: 'GPText',
  color: '$text',
  maxFontSizeMultiplier: MAX_FONT_SCALE,

  variants: {
    variant: {
      display: typography.display,
      h1: typography.h1,
      h2: typography.h2,
      h3: typography.h3,
      body: typography.body,
      bodyStrong: typography.bodyStrong,
      bodySm: typography.bodySm,
      label: typography.label,
      button: typography.button,
      caption: typography.caption,
    },
    tone: {
      default: { color: '$text' },
      muted: { color: '$textMuted' },
      subtle: { color: '$textSubtle' },
      primary: { color: '$primaryText' },
      onPrimary: { color: '$onPrimary' },
      error: { color: '$error' },
      success: { color: '$success' },
      warning: { color: '$warning' },
      info: { color: '$info' },
    },
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  } as const,

  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
});

export type TextProps = GetProps<typeof Text>;
