import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/Input/ControlledInput';
import { useAddressDialog } from './useAddressDialog';

type AddressDialogProps = {
  isOpen: boolean;
  result: PlaceProps[];
  isLoading: boolean;
  setOpen(isOpen: boolean): void;
  handleSearch(): void;
};

export const AddressDialog = ({
  isOpen,
  result,

  setOpen,
  handleSearch,
  isLoading,
}: AddressDialogProps) => {
  const { handleSelectPlace } = useAddressDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden transition-all duration-500 ease-in-out">
        <DialogHeader>
          <DialogTitle>Pesquisar o local</DialogTitle>
          <DialogDescription>
            Pesquise o local que procura pelo nome da rua, bairro, cidade ou
            país.
          </DialogDescription>

          <div className="flex gap-2  items-end w-full mt-3">
            <div className="flex flex-col w-full  p-0">
              <ControlledInput
                label="Nome do local"
                name="streetSearch"
                placeholder="Digite aqui"
              />
            </div>
            <Button className="h-9" onClick={handleSearch}>
              Pesquisar <Search />
            </Button>
          </div>

          {!isLoading &&
            result.map((item) => (
              <Button
                variant="ghost"
                key={item.name}
                className="flex justify-start border border-zinc-300 dark:border-zinc-700"
                onClick={() => {
                  handleSelectPlace(item);
                  setOpen(false);
                }}
              >
                {item.displayName}
              </Button>
            ))}

          {isLoading && (
            <div className="flex flex-col gap-2 mt-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
