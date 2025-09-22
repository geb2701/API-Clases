import { Skeleton } from "../ui/skeleton";

export const SkeletonSmallCard = () => {
  return (
    <div className="flex flex-col space-y-8 p-8">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

export const SkeletonMediumCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[50px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  );
};
