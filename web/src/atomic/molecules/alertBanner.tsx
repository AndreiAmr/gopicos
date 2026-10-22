import * as React from 'react';
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type AlertBannerVariant = 'error' | 'success' | 'info';

type AlertBannerProps = {
  variant: AlertBannerVariant;
  children: React.ReactNode;
  /** Acao opcional (ex.: "Tentar novamente"). */
  action?: { label: string; onClick: () => void };
  className?: string;
};

const variantStyles: Record<
  AlertBannerVariant,
  { border: string; icon: string; Icon: typeof InfoIcon }
> = {
  error: {
    border: 'border-gp-error border-l-gp-error',
    icon: 'text-gp-error',
    Icon: AlertCircleIcon,
  },
  success: {
    border: 'border-gp-success border-l-gp-success',
    icon: 'text-gp-success',
    Icon: CheckCircle2Icon,
  },
  info: {
    border: 'border-gp-info border-l-gp-info',
    icon: 'text-gp-info',
    Icon: InfoIcon,
  },
};

/** Bloco inline que nao some sozinho (DS: AlertBanner). */
function AlertBanner({
  variant,
  children,
  action,
  className,
}: AlertBannerProps) {
  const { border, icon, Icon } = variantStyles[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex flex-col gap-1 rounded-md border-[1.5px] border-l-4 bg-gp-sunken p-3 text-body-sm text-gp-text',
        border,
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className={cn('size-5 shrink-0', icon)} aria-hidden="true" />
        <p>{children}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="ml-7 min-h-12 self-start text-body-sm font-semibold text-gp-primary-text underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gp-focus"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export { AlertBanner };
