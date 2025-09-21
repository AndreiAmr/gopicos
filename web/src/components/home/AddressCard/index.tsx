import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { AddressDialog } from './components/AddressDialog';
import { Button } from '../../ui/button';
import { Search, MapPin, Earth, Map } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAddressCard } from './useAddressCard';

export const AddressCard = () => {
  const {
    addressValues,
    places,
    isAddressDialogOpen,
    setIsAddressDialogOpen,

    handleSearch,
    isLoading,
  } = useAddressCard();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 1,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Localidade</CardTitle>
          <CardDescription>
            Pesquise e selecione o local do pico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full flex justify-start bg-background/40 text-muted-foreground hover:bg-background/70 cursor-pointer"
            onClick={() => {
              setIsAddressDialogOpen(true);
            }}
          >
            <Search />

            <p>Pesquisar local</p>
          </Button>
          <AddressDialog
            isOpen={isAddressDialogOpen}
            setOpen={setIsAddressDialogOpen}
            result={places}
            handleSearch={handleSearch}
            isLoading={isLoading}
          />

          {addressValues.street && (
            <div className="flex flex-col mt-2">
              <div className="w-full flex items-center gap-2 border text-sm mt-2 text-muted-foreground  rounded p-2 text-title">
                <MapPin className="w-4 h-4" />
                {addressValues.street}
              </div>
              {addressValues.state && (
                <div className="w-full flex items-center gap-2 border text-sm mt-2 text-muted-foreground rounded p-2">
                  <Earth className="w-4 h-4" />
                  {addressValues.state}
                </div>
              )}

              {addressValues.country && (
                <div className="w-full flex items-center gap-2 border text-sm mt-2 text-muted-foreground rounded p-2">
                  <Map className="w-4 h-4" />
                  {addressValues.country}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
