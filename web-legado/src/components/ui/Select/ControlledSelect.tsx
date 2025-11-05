import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '.';
import { cn } from '@/lib/utils';

type IValue = string | boolean | boolean | JSON;

export type IOption = {
  value: IValue;
  label: string;
};

interface ControlledSelectProps {
  name: string;
  value: string;
  label: string;
  options: IOption[];
  onChange(value: IValue): void;
  className?: string;
  disabled?: boolean;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  name,
  options,
  // value,
  label,
  className,
  disabled = false,
  onChange,
}: ControlledSelectProps) => {
  const { control } = useFormContext();

  const handleChange = useCallback(
    (value: string) => {
      const selected = options.find((opt) => opt.label === value);

      if (!selected) return;

      onChange(selected?.value);
    },
    [onChange, options]
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({}) => (
        <div className="flex flex-col flex-1 gap-1">
          <label className="text-sm text-muted-foreground">{label}</label>
          <Select onValueChange={handleChange}>
            <SelectTrigger
              className={cn('w-full', className)}
              disabled={disabled}
            >
              <SelectValue placeholder="Selecione" className="bg-red-200" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <>
                  <SelectItem value={option.label}>{option.label}</SelectItem>
                </>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
};

export default ControlledSelect;
