import { Skeleton } from "~/components/ui/skeleton";

export default async function Loading() {
  return (
    <>
      <div>
        <header className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </header>

        <div className="mt-4 rounded-md border">
          <div className="space-y-4 p-4">
            {new Array(10).fill(null).map((_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
