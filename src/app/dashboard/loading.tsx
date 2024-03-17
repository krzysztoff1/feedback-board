import { Skeleton } from "~/components/ui/skeleton";

export default async function Loading() {
  return (
    <>
      <div className="max-w-xl">
        <Skeleton className="mb-8 h-12" />
        <Skeleton className="h-24" />
      </div>
    </>
  );
}
