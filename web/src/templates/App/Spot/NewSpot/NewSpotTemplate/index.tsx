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
      <div className=" relative flex flex-col flex-1 mt-5">
        <NewSpotMap />
        <NewSpotMapControls />
      </div>
    </div>
  );
};
