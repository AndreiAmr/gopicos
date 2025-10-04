import { fetchCreateSpot } from '@/repository/spot/spotRepository';

import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import z from 'zod';

const validationSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  modality: z.string().nonempty(),
  equipmentRequired: z.string().nonempty(),
  isPaid: z.string().nonempty(),
  alwaysOpen: z.string().nonempty(),
  entryAmount: z.string().optional(),
  hasCoverage: z.string().nonempty(),
});

export const useSpotInfo = () => {
  const formMethods = useFormContext<NewSpotProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fieldsValues = useMemo(() => {
    const formValues = formMethods.getValues();

    return {
      name: formValues.name,
      description: formValues.description,
      modality: formValues.modality,
      equipmentRequired: formValues.equipmentRequired,
      isPaid: formValues.isPaid,
      alwaysOpen: formValues.alwaysOpen,
      entryAmount: formValues.entryAmount,
      hasCoverage: formValues.hasCoverage,
      coordinates: formValues.address.coordinates,
      openingHours: formValues.openingHours,
    };
  }, [formMethods, formMethods.getValues()]);

  const handleValidateFields = useCallback(() => {
    return validationSchema.parse(fieldsValues);
  }, [fieldsValues]);

  const isFieldsValid = useMemo(() => {
    try {
      return true;
    } catch {
      return false;
    }
  }, [handleValidateFields, formMethods.getValues()]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = formMethods.getValues();
      console.log('🚀 ~ useSpotInfo ~ values:', values);

      if (!isFieldsValid) return;
      setIsLoading(true);

      await fetchCreateSpot({
        images: values.images,
        ...fieldsValues,
      });
    } catch (err) {
      // console.log('🚀 ~ handleSubmit ~ err:', JSON.stringify(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [formMethods, isFieldsValid]);

  return { handleSubmit, isFieldsValid, isLoading };
};
