'use client';

import { PageTitle } from '@/atomic/atoms/PageTitle';
import { NewSpotMap } from './components/NewSpotMap';
import { NewSpotMapControls } from './components/NewSpotMapControls';

export const NewSpotTemplate = () => {
  return (
    <div className="h-full w-full p-8 flex flex-col ">
      <PageTitle
        name="Marcação e endereço"
        title="Selecione o local e o tipo de marcação que gostaria de fazer  e verifique o endereço:"
      />
      <div className="flex flex-col flex-1 gap-3 mt-14 md:flex-row ">
        <NewSpotMapControls />
        <NewSpotMap />
      </div>
    </div>
  );
};
