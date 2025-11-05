import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type OptionProps = {
  value: string;
  label: string;
};

type SelectProps = {
  title: string;
  placeholder: string;
  options: OptionProps[];
  id?: string;
  error?: string;
  onChange(value: string): void;
};

export const Select = ({
  error,
  title,
  placeholder,
  options,
  id,
  onChange,
}: SelectProps) => {
  return (
    <ShadcnSelect onValueChange={onChange}>
      <div className="">
        <label
          className={cn('text-sm mb-0 text-gray-700', error && 'text-red-500')}
          htmlFor={id}
        >
          {title}
        </label>
        <SelectTrigger
          className={cn(
            'w-full bg-white',
            error && 'border border-destructive ring-destructive/40',
          )}
        >
          <SelectValue placeholder={placeholder} id={id} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </div>
    </ShadcnSelect>
  );
};
