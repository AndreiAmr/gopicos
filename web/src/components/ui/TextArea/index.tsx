import { cn } from '@/lib/utils';
import { Textarea as TextareaCn } from '@/components/ui/textarea';

type TextareaCnProps = React.ComponentProps<'textarea'> & {
  label: string;
  placeholder: string;
  error?: string;
};

export const TextArea = ({
  label,
  placeholder,
  error,
  ...TextareaCnProps
}: TextareaCnProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className={cn('text-sm text-gray-300', error && 'text-red-500')}>
        {label}
      </label>
      <TextareaCn
        value={undefined}
        onChange={() => {}}
        className={cn(
          'bg-background',
          error && 'border border-red-700 bg-red-50'
        )}
        placeholder={placeholder}
        {...TextareaCnProps}
      />
      <p className="text-red-500 text-xs">{error}</p>
    </div>
  );
};
