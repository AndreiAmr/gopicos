import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';

type InputIconProps = React.ComponentProps<'input'> & {
  icon: React.ReactNode;
  containerClassName: ClassValue;
};

export const InputIcon = ({
  icon,
  containerClassName,
  ...inputProps
}: InputIconProps) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center bg-sidebar px-3 py-2 max-w-3xl w-[50%] rounded-xl shadow-xl gap-3',
        containerClassName
      )}
    >
      <Input
        className={cn(
          'border-none outline-none shadow-none',
          inputProps.className && inputProps.className
        )}
        {...inputProps}
      />
      {icon}
    </div>
  );
};
