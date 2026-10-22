import * as React from 'react';
import { AlertCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type InputProps = React.ComponentProps<'input'> & {
  label: string;
  containerStyle?: React.ComponentProps<'div'>['className'];
  isLoading?: boolean;
  error?: string;
  /** Texto de apoio fixo abaixo do campo (ex.: "Minimo de 8 caracteres."). */
  hint?: string;
};

function Input({
  label,
  className,
  type,
  containerStyle,
  isLoading = false,
  error,
  hint,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={cn('flex flex-col gap-1', containerStyle)}>
      <label
        htmlFor={inputId}
        className={cn(
          'text-body-sm font-semibold text-gp-text',
          error && 'text-gp-error',
        )}
      >
        {label}
      </label>

      {isLoading && <Skeleton className="h-12 w-full" />}
      {!isLoading && (
        <>
          <input
            id={inputId}
            type={type}
            data-slot="input"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'h-12 w-full min-w-0 rounded-md border border-input bg-gp-surface px-3 py-1 text-body text-gp-text shadow-1 transition-colors duration-150 outline-none',
              'placeholder:text-gp-text-subtle file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'focus-visible:ring-2 focus-visible:ring-gp-focus focus-visible:border-gp-focus',
              'disabled:cursor-not-allowed disabled:opacity-40',
              'aria-invalid:border-gp-error aria-invalid:focus-visible:ring-gp-error',
              className,
            )}
            {...props}
          />
          {hint && !error && (
            <p id={hintId} className="text-body-sm text-gp-text-muted">
              {hint}
            </p>
          )}
          {error && (
            <p
              id={errorId}
              className="mt-1 flex items-center gap-1 text-caption text-gp-error"
            >
              <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export { Input };
