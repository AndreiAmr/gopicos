import * as React from 'react';
import { AlertCircleIcon, MapPinOffIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/atomic/atoms/button';
import { Text } from '@/atomic/atoms/text';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** `empty` (padrao) ou `error` (mensagem amigavel + acao de tentar novamente). */
  variant?: 'empty' | 'error';
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

function EmptyState({
  title,
  description,
  variant = 'empty',
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const isError = variant === 'error';
  const label = actionLabel ?? (isError ? 'Tentar novamente' : undefined);

  return (
    <div
      data-slot="empty-state"
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex flex-col items-center gap-3 px-4 py-10 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex size-16 items-center justify-center rounded-full',
          isError ? 'bg-gp-sunken text-gp-error' : 'bg-gp-primary-soft text-gp-primary-text',
        )}
      >
        {icon ??
          (isError ? (
            <AlertCircleIcon className="size-8" />
          ) : (
            <MapPinOffIcon className="size-8" />
          ))}
      </span>
      <Text variant="h3" as="h2">
        {title}
      </Text>
      {description && (
        <Text variant="body-sm" tone="muted" className="max-w-sm">
          {description}
        </Text>
      )}
      {label && onAction && (
        <Button
          variant={isError ? 'secondary' : 'primary'}
          size="lg"
          onClick={onAction}
          className="mt-2"
        >
          {label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
