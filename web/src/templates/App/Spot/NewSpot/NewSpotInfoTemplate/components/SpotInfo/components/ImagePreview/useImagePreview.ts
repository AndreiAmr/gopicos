import { ChangeEvent, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

const MAX_IMAGES = 8;

export const useImagePreview = () => {
  const formMethods = useFormContext<NewSpotProps>();

  const imagesSelected = formMethods.watch('images');

  const hasReachedLimit = useMemo(() => {
    return imagesSelected.length === MAX_IMAGES;
  }, [imagesSelected]);

  const images = useMemo(() => {
    return imagesSelected.map((i) => ({
      url: URL.createObjectURL(i),
      name: i.name,
    }));
  }, [imagesSelected]);

  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('🚀 ~ useImagePreview ~ event:', event);
    const filesReceived = event.target?.files;

    if (!filesReceived) return;

    const files: File[] = [...imagesSelected];

    for (let i = 0; i < filesReceived.length; i++) {
      files.push(filesReceived[i]);
    }

    formMethods.setValue('images', files);
  };

  const handleRemoveImage = (imgString: string) => {
    const newImages = imagesSelected.filter((item) => item.name !== imgString);

    formMethods.setValue('images', newImages);
  };

  return {
    handleSelectImage,
    images,

    handleRemoveImage,
    hasReachedLimit,
  };
};
