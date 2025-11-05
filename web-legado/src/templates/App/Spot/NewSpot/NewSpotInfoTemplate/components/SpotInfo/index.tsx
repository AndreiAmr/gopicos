'use client';
import { PageTitle } from '@/atomic/atoms/PageTitle';
import { BasicData } from './components/BasicData';
import { Button } from '@/components/ui/button';
import { useSpotInfo } from './useSpotInfo';

export const SpotInfo = () => {
  const { handleSubmit, isFieldsValid, isLoading } = useSpotInfo();

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll py-10">
      <div className="py-0 px-20 w-full">
        <PageTitle
          name="Detalhes do pico"
          title="Preencha as informações sobre esse local"
        />
        <BasicData />

        <Button
          onClick={handleSubmit}
          disabled={!isFieldsValid || isLoading}
          className="mt-2"
        >
          {isLoading ? 'Carregando...' : 'Cadastrar novo pico'}
        </Button>
      </div>
    </div>
  );
};
