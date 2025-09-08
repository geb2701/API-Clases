import { Skeleton } from "../ui/skeleton";

const SkeletonTable = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[75px] w-full rounded-lg" />
      <Skeleton className="h-6 w-full rounded-lg" />
      <Skeleton className="h-6 w-full rounded-lg" />
    </div>
  );
};

export default SkeletonTable;
