import * as React from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type InputProps = React.ComponentProps<'input'> & {
  label: string;
  containerStyle?: React.ComponentProps<'div'>['className'];
  isLoading?: boolean;
  error?: string;
};

function Input({
  label,
  className,
  type,
  containerStyle,
  isLoading = false,
  error,
  ...props
}: InputProps) {
  return (
    <div className={cn('gap-0', containerStyle)}>
      <label
        className={cn('text-sm mb-0 text-gray-700', error && 'text-red-500')}
      >
        {label}
      </label>

      {isLoading && <Skeleton className="w-full h-9 shadow" />}
      {!isLoading && (
        <>
          <input
            type={type}
            data-slot="input"
            className={cn(
              ' file:text-foreground placeholder:text-muted-foreground selection:bg-muted-foreground selection:text-primary-foreground dark:bg-input/30  h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-white shadow',
              className,
              error && 'border border-destructive',
            )}
            {...props}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      )}
    </div>
  );
}

export { Input };
