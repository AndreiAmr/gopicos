import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '.';
import { ComponentProps } from 'react';

type ControlledInputProps = ComponentProps<'input'> & {
  name: string;
  label: string;
};

export const ControlledInput = ({ name, ...props }: ControlledInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Input {...props} {...field} />}
    />
  );
};
