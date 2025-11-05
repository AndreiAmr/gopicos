import { InputIcon } from '@/atomic/atoms/InputIcon';
import {
  Search,
  SquareDashed,
  X,
  MapPin,
  RotateCcw,
  Trash,
  ChevronRight,
} from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useNewSpotMapControls } from './useNewSpotMapControls';
import { IFowardGeocodingResponse } from '@/repository/geocoding/geocodingRepository';
import TitleDescriptionButton from '@/atomic/molecules/TitleDescriptionButton';
import { formatLocationString } from '@/utils/geocoding';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const NewSpotMapControls = () => {
  const {
    search,
    setSearch,
    data,
    isPopoverOpen,
    setIsPopoverOpen,
    loading,
    handleClickItem,
    markingType,
    handleChangeMarkingType,
    handleRedo,
    handleTrash,
    handleContinue,
  } = useNewSpotMapControls();

  const renderItems = ({
    name,
    district,
    suburb,
    city,
    lat,
    lng,
    boundingBox,
  }: IFowardGeocodingResponse) => {
    const description = `${formatLocationString(
      district,
      !suburb
    )} ${formatLocationString(suburb, !city)} ${formatLocationString(
      city,
      true
    )}`;

    return (
      <>
        <TitleDescriptionButton
          title={name}
          description={description}
          onClick={() => handleClickItem(lat, lng, boundingBox)}
        />
        <div className="w-full border-t border-gray-200"></div>
      </>

      // <div className="w-md px-2 flex items-center justify-between">
      //   <div className="">
      //     <h1>{name}</h1>
      //     <h1>
      //       {district ? `${district},` : ''} {suburb ? `${suburb},` : ''}{' '}
      //       {city || ''}
      //     </h1>
      //   </div>
      //   <ArrowRight />
      // </div>
    );
  };

  return (
    <>
      <div className="absolute w-full p-3">
        <div className="flex flex-row">
          <Popover open={isPopoverOpen}>
            <PopoverTrigger className="w-md">
              <InputIcon
                icon={
                  isPopoverOpen ? (
                    <X onClick={() => setIsPopoverOpen(false)} />
                  ) : (
                    <Search />
                  )
                }
                placeholder="Digite aqui para pesquisar o local"
                className="border-none shadow-none h-5"
                containerClassName="w-full max-w-md"
                onFocus={() => setIsPopoverOpen(true)}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </PopoverTrigger>
            <PopoverContent className="p-0 max-h-[50vh] w-[100%] flex flex-col gap-0 px-0 overflow-scroll cursor-pointer">
              {loading && 'Carregando..'}
              {!loading && data?.getFowardGeocoding.map(renderItems)}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className=" left-1/2 -translate-x-1/2 bg-sidebar-background h-15  absolute bottom-4 rounded-md flex items-center gap-2 px-4">
        <Button
          className={cn(
            markingType === 'POLYGON' ? 'bg-amber-300' : 'bg-gray-100',
            'hover:bg-amber-200'
          )}
          onClick={() => handleChangeMarkingType('POLYGON')}
        >
          <SquareDashed className={cn('text-gray-600')} />
        </Button>
        <Button
          onClick={() => handleChangeMarkingType('POINT')}
          className={cn(
            markingType === 'POINT' ? 'bg-amber-300' : 'bg-gray-100',
            'hover:bg-amber-200'
          )}
        >
          <MapPin className={cn('text-gray-600')} />
        </Button>

        <div className="h-1/2 border border-r-1 bg-accent "></div>

        <Button onClick={handleRedo} className="hover:bg-amber-200 bg-gray-300">
          <RotateCcw />
        </Button>
        <Button
          className=" hover:bg-amber-200 bg-gray-300"
          onClick={handleTrash}
        >
          <Trash className="text-red-600" />
        </Button>

        <div className="h-1/2 border border-r-1 bg-accent "></div>

        <Button className="bg-primary " onClick={handleContinue}>
          Continuar <ChevronRight />
        </Button>
      </div>
    </>
  );
};
