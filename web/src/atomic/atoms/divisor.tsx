import { cn } from '@/lib/utils';

type DivisorProps = {
  className?: string;
};

export const Divisor = ({ className }: DivisorProps) => {
  return <div className={cn('w-full h-px bg-gray-300 my-4', className)}></div>;
};
