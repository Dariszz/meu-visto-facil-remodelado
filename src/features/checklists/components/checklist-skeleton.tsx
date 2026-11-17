import { LoadingRegion } from "@/components/feedback/loading-region";
import { Skeleton } from "@/components/ui/skeleton";

export function ChecklistSkeleton() {
  return (
    <LoadingRegion label="Carregando checklist…">
      <Skeleton className="h-9 w-72 max-w-full" />
      <div className="mt-8 space-y-6">
        {[0, 1, 2].map((key) => (
          <div key={key} className="flex gap-4">
            <Skeleton className="size-5 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
