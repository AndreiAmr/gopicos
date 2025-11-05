import * as React from 'react';

import { cn } from '@/lib/utils';

type TextAreaProps = React.ComponentProps<'textarea'> & {
  label: string;
  error?: string;
};

function Textarea({ className, label, error, ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={cn('text-sm mb-0 text-gray-700', error && 'text-red-500')}
      >
        {label}
      </label>
      <textarea
        data-slot="textarea"
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'resize-none h-30 shadow',
          error && 'border border-destructive',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export { Textarea };
