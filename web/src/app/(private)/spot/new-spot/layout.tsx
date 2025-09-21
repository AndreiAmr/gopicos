'use client';

import { PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNewSpotLayout } from './useNewSpotLayout';

export default function Layout({ children }: PropsWithChildren) {
  const { formMethods } = useNewSpotLayout();

  return <FormProvider {...formMethods}>{children}</FormProvider>;
}
