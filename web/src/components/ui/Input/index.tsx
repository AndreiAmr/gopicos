import { cn } from '@/lib/utils';
import { Input as InputCn } from '../input';

type InputProps = React.ComponentProps<'input'> & {
  label: string;
  placeholder?: string;
  error?: string;
};

export const Input = ({
  label,
  placeholder,
  error,
  ...inputProps
}: InputProps) => {
  return (
    <div className="flex flex-col flex-1 gap-1">
      <label
        className={cn('text-sm text-muted-foreground', error && 'text-red-500')}
      >
        {label}
      </label>
      <InputCn
        className={cn(
          'bg-background',
          error && 'border border-red-700 bg-red-50 m-0'
        )}
        placeholder={placeholder}
        // type="password"

        {...inputProps}
        onChange={inputProps.onChange}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
