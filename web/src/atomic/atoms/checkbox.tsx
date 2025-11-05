import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label: string;
};

function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2 ">
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          'peer border-input dark:bg-input/30 dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 w-5 h-5 data-[state=checked]:bg-yellow-300 data-[state=checked]:text-gray-700 data-[state=checked]:border-none',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <label htmlFor={props.id} className="cursor-pointer text-gray-700">
        {label}
      </label>
    </div>
  );
}

export { Checkbox };
