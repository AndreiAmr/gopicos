import { ISearchPlace } from '@/store/searchPlace/searchPlaceTypes';
import { MapPin } from 'lucide-react';

type PlaceItemProps = ISearchPlace & {
  onClick(): void;
};

export const PlaceItem = ({
  name,
  state,
  district,
  onClick,
}: PlaceItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center overflow-hidden text-ellipsis gap-2 hover:bg-blue-50 p-3 rounded-sm text-accent-foreground cursor-pointer"
    >
      <MapPin />
      <p className="text-md w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {name}, {district && `${district},`} {state}
      </p>
    </div>
  );
};
