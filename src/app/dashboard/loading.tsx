import { SkeletonCard } from "../_components/dashboard/skeleton-card";

export default async function Loading() {
  return (
    <>
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </>
  );
}
