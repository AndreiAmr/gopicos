import { cva } from 'class-variance-authority';

export const textVariants = cva('', {
  variants: {
    variant: {
      display: 'text-display font-bold',
      h1: 'text-h1 font-bold',
      h2: 'text-h2 font-semibold',
      h3: 'text-h3 font-semibold',
      body: 'text-body font-normal',
      'body-strong': 'text-body font-semibold',
      'body-sm': 'text-body-sm font-normal',
      label: 'text-body-sm font-semibold',
      caption: 'text-caption font-medium',
    },
    tone: {
      default: 'text-gp-text',
      muted: 'text-gp-text-muted',
      subtle: 'text-gp-text-subtle',
      primary: 'text-gp-primary-text',
      error: 'text-gp-error',
      success: 'text-gp-success',
    },
  },
  defaultVariants: { variant: 'body', tone: 'default' },
});
