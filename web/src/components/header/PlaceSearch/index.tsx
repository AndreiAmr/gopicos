import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import { usePlaceSearch } from './usePlaceSearch';
import { PlaceSearchLoadingSkeleton } from './LoadingSkeleton';
import { PlaceItem } from './PlaceItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/atomic/atoms/button';

export const PlaceSearch = () => {
  const {
    value,
    setValue,
    handleSearch,
    isLoading,
    places,
    handleClickPlaceItem,
  } = usePlaceSearch();

  return (
    <Dialog modal>
      <div className="flex gap-2 w-100 flex-1  md:flex ">
        <InputGroup className="bg-background">
          <InputGroupInput
            placeholder="Nome do local"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <DialogTrigger>
          <Button onClick={handleSearch}>Pesquisar</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Locais encontrados</DialogTitle>
          <DialogDescription>Selecione o local desejado</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <PlaceSearchLoadingSkeleton />
        ) : (
          <ScrollArea className="w-full max-h-70">
            {places?.map((item) => (
              <PlaceItem {...item} onClick={() => handleClickPlaceItem(item)} />
            ))}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
