import { Skeleton } from '@/components/ui/skeleton';

export const ListItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="w-[100%] h-8" />
      <Skeleton className="w-[100%] h-8" />
      <Skeleton className="w-[100%] h-8" />
    </div>
  );
};
