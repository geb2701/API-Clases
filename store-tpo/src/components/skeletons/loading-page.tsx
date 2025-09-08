import { Typography } from "../typography/typography";
import Spinner from "./spinner";

interface LoadingPage {
  title: string;
}

export default function SkeletonLoadingPage({ title }: LoadingPage) {
  return (
    <div className="flex items-center justify-center overflow-hidden pt-10">
      <div className="space-y-6">
        <Typography
          variant="h3"
          className="animate-pulse text-center text-primary">
          {title}
        </Typography>

        <div className="mt-8 flex justify-center py-2">
          <Spinner className="size-20" iconSize="lg" />
        </div>

        <div className="mx-auto h-8 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />

        <div className="flex justify-center space-x-2">
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
