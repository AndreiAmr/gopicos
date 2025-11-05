import { cn } from '@/lib/utils';
import { HTMLAttributes, PropsWithChildren } from 'react';

type ShadowContainerProps = PropsWithChildren & {
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

export const ShadowContainer = ({
  children,
  className,
}: ShadowContainerProps) => {
  return (
    <div
      className={cn('flex flex-col shadow-double p-10 rounded-2xl', className)}
    >
      {children}
    </div>
  );
};
