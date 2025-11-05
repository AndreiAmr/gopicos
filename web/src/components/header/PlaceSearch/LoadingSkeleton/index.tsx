import { Skeleton } from '@/components/ui/skeleton';

export const PlaceSearchLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};
