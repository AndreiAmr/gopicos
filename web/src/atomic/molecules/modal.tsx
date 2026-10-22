import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** Area de acoes (botoes) fixa no rodape. */
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Dialog centralizado a partir de 640px; abaixo disso vira bottom sheet
 * (raio xl no topo, alca). Fecha por botao, Esc e clique no overlay (Radix).
 */
function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="modal-overlay"
          className="fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          data-slot="modal"
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            'fixed z-40 flex max-h-[90dvh] flex-col gap-4 overflow-y-auto bg-gp-surface p-6 text-gp-text shadow-3 outline-none',
            'duration-200 motion-reduce:duration-0 data-[state=closed]:animate-out data-[state=open]:animate-in',
            // < 640px: bottom sheet
            'inset-x-0 bottom-0 rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            // >= 640px: dialog centralizado
            'sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-0',
            className,
          )}
        >
          <span
            aria-hidden="true"
            className="mx-auto -mt-2 h-1 w-10 rounded-full bg-gp-border sm:hidden"
          />
          <div className="flex flex-col gap-1 pr-10">
            <DialogPrimitive.Title className="text-h3 font-semibold">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-body-sm text-gp-text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          {children}
          {footer ? (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {footer}
            </div>
          ) : null}
          <DialogPrimitive.Close
            aria-label="Fechar"
            className="absolute top-3 right-3 inline-flex size-12 items-center justify-center rounded-md text-gp-text outline-none hover:bg-gp-sunken focus-visible:ring-2 focus-visible:ring-gp-focus"
          >
            <XIcon className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { Modal };
