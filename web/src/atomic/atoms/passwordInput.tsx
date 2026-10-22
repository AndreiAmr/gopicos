import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Input } from './input';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

/** Input de senha com botao (alvo 48x48) que alterna mostrar/ocultar. */
function PasswordInput({
  className,
  containerStyle,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn('relative', containerStyle)}>
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12', className)}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-0 top-6 flex size-12 items-center justify-center rounded-md text-gp-text-muted outline-none hover:text-gp-text focus-visible:ring-2 focus-visible:ring-gp-focus"
      >
        {visible ? (
          <EyeOffIcon className="size-5" aria-hidden="true" />
        ) : (
          <EyeIcon className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
