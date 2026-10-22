import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { textVariants } from './text.variants';

type TextVariant = NonNullable<VariantProps<typeof textVariants>['variant']>;

const defaultTag: Record<TextVariant, React.ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-strong': 'p',
  'body-sm': 'p',
  label: 'span',
  caption: 'span',
};

type TextProps = Omit<React.ComponentProps<'p'>, 'color'> &
  VariantProps<typeof textVariants> & {
    /** Troca a tag HTML sem alterar o estilo (ex.: h2 visual dentro de um h3 semantico). */
    as?: React.ElementType;
  };

function Text({ variant = 'body', tone, as, className, ...props }: TextProps) {
  const Comp = as ?? defaultTag[variant ?? 'body'];

  return (
    <Comp
      data-slot="text"
      className={cn(textVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

export { Text };
