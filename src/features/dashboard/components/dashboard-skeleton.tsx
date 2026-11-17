import { LoadingRegion } from "@/components/feedback/loading-region";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <LoadingRegion label="Carregando seu painel…">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-4 h-4 w-80 max-w-full" />
      <Skeleton className="mt-12 h-5 w-36" />
      <div className="mt-3 divide-y border-y">
        {[0, 1].map((key) => (
          <div
            key={key}
            className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_12rem]"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
