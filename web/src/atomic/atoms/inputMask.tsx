import { InputMask as ReactInputMask } from '@react-input/mask';
import { cn } from '@/lib/utils';
import React from 'react';

type InputMaskProps = Omit<
  React.ComponentProps<typeof ReactInputMask>,
  'onChange'
> & {
  label?: string;
  containerStyle?: React.ComponentProps<'div'>['className'];
  error?: string;
  replacement?: Record<string, RegExp>;
  mask: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
};

export function InputMask({
  label,
  className,
  containerStyle,
  error,
  replacement,
  mask,
  onChange,
  ...props
}: InputMaskProps) {
  return (
    <div className={cn('gap-0', containerStyle)}>
      {label && (
        <label
          className={cn('text-sm mb-0 text-gray-700', error && 'text-red-500')}
        >
          {label}
        </label>
      )}

      <ReactInputMask
        replacement={replacement}
        mask={mask}
        onChange={onChange}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-muted-foreground selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-white shadow',
          className,
          error && 'border border-destructive',
        )}
        {...props}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
