import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { PropsWithChildren } from 'react';

type ButtonTooltipProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & PropsWithChildren & {
    tooltip: string;
  };

export const ButtonTooltip = ({
  tooltip,
  children,
  ...buttonProps
}: ButtonTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...buttonProps}
          className={cn('cursor-pointer', buttonProps.className)}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" hidden={false}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
