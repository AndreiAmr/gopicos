import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 aria-busy:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-gp-focus focus-visible:ring-offset-2 focus-visible:ring-offset-gp-bg",
  {
    variants: {
      variant: {
        primary:
          'bg-gp-primary text-gp-on-primary hover:bg-gp-primary-hover active:bg-gp-primary-hover',
        // Aliases legados (shadcn) mantidos para nao quebrar usos existentes
        default:
          'bg-gp-primary text-gp-on-primary hover:bg-gp-primary-hover active:bg-gp-primary-hover',
        outline:
          'border border-gp-border bg-gp-surface text-gp-text hover:bg-gp-sunken active:bg-gp-sunken',
        secondary:
          'border border-gp-border bg-gp-surface text-gp-text hover:bg-gp-sunken active:bg-gp-sunken',
        ghost: 'text-gp-text hover:bg-gp-sunken active:bg-gp-sunken',
        destructive: 'bg-gp-error text-gp-bg hover:opacity-90 active:opacity-90',
        link: 'text-gp-primary-text underline-offset-4 hover:underline',
      },
      size: {
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        sm: 'h-8 gap-1.5 px-3 text-sm',
        icon: 'size-12',
        default: 'h-11 px-4 text-sm',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);
