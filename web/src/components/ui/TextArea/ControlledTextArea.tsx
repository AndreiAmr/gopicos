import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '../textarea';
import { ComponentProps } from 'react';

type ControlledTextareaProps = ComponentProps<typeof Textarea> & {
  name: string;
  label: string;
};

export const ControlledTextarea = ({
  name,
  ...props
}: ControlledTextareaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Textarea {...props} {...field} />}
    />
  );
};
