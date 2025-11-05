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
      markingType: formValues.markingType,
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
      // console.log('🚀 ~ useSpotInfo ~ values:', values);

      if (!isFieldsValid) return;
      setIsLoading(true);

      const formData = new FormData();

      const operations = JSON.stringify({
        query: `
      mutation CreateSpot($input: NewSpotInput!) {
        createSpot(input: $input) {
          name
        }
      }
    `,
        variables: {
          input: fieldsValues,
        },
      });

      formData.append('operations', operations);

      const map: Record<number, string[]> = {};

      values.images.forEach((_, index) => {
        map[index] = [`variables.input.images.${index}`];
      });

      formData.append('map', JSON.stringify(map));

      values.images.forEach((file, i) => {
        formData.append(`${i}`, file);
      });

      console.log('🚀 ~ useSpotInfo ~ formData:', formData);
      const res = await fetch('/api/spot/createSpot', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: formData,
      });

      // await fetchCreateSpot({
      //   images: values.images,
      //   ...fieldsValues,
      // });
    } catch (err) {
      // console.log('🚀 ~ handleSubmit ~ err:', JSON.stringify(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [formMethods, isFieldsValid]);

  return { handleSubmit, isFieldsValid, isLoading };
};
