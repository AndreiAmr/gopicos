import { useFormContext } from 'react-hook-form';

export const useBasicData = () => {
  const formMethods = useFormContext<NewSpotProps>();

  const name = formMethods.watch('name');

  const description = formMethods.watch('description');

  const handleChange = (name: keyof NewSpotProps, value: string) => {
    formMethods.setValue(name, value);
  };

  return { name, description, handleChange };
};
